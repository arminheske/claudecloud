'use strict';
/*
 * Word Race – Server.
 *   npm start            (Port über PORT, Standard 3000)
 *
 * Lehrer: /teacher.html  legt einen Raum mit Vokabelset an und zeigt den Code + das Rennen.
 * Schüler: /student.html  tritt per Code bei und tippt die Übersetzungen.
 *
 * Alles Spielrelevante (Wörter, Lösungen, Tempo) liegt hier auf dem Server; die Clients
 * bekommen nur Wort + Schwierigkeit und senden ihre Eingabe. So kann niemand schummeln.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');
const { createEngine } = require('./src/engine');

const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_ROOMS = 200;
const MAX_VOCAB = 2000;
const ROOM_TTL_MS = 4 * 60 * 60 * 1000;
const TICK_MS = 100;
const BROADCAST_EVERY = 2; // Ticks -> 5 Updates pro Sekunde
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
};

function createServer(opts) {
  opts = opts || {};
  const rooms = new Map();

  // ---------------------------------------------------------------- HTTP (statische Dateien)
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const file = path.normalize(path.join(PUBLIC_DIR, urlPath));
    if (!file.startsWith(PUBLIC_DIR + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end('Nicht gefunden'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  });

  const wss = new WebSocketServer({ server, maxPayload: 1024 * 1024 });

  // ---------------------------------------------------------------- Hilfsfunktionen
  const token = () => crypto.randomBytes(16).toString('hex');
  const send = (ws, msg) => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(msg)); };

  function newCode() {
    for (;;) {
      let c = '';
      for (let i = 0; i < 5; i++) c += CODE_CHARS[crypto.randomInt(CODE_CHARS.length)];
      if (!rooms.has(c)) return c;
    }
  }

  function cleanName(s) {
    return String(s || '').replace(/[\u0000-\u001f<>&"]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
  }

  function parseVocab(list) {
    if (!Array.isArray(list)) return null;
    const out = [];
    for (const v of list.slice(0, MAX_VOCAB)) {
      if (!v) continue;
      const word = String(v.word || '').trim().slice(0, 100);
      const translation = String(v.translation || '').trim().slice(0, 100);
      if (word && translation) out.push({ id: out.length, word, translation });
    }
    return out.length >= 3 ? out : null;
  }

  function clamp(n, lo, hi, dflt) {
    n = Number(n);
    return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt;
  }

  // ---------------------------------------------------------------- Räume
  function teacherState(room) {
    const e = room.engine;
    return {
      t: 'state', code: room.code, status: e.state.status, time: Math.round(e.state.time * 10) / 10,
      duration: e.cfg.durationSec, trackLength: e.cfg.trackLength, maxPlayers: e.cfg.maxPlayers,
      players: e.publicPlayers(), vocabCount: room.vocabCount,
      results: e.state.status === 'done' ? e.results() : null,
    };
  }

  function pushTeacher(room) {
    const msg = teacherState(room);
    room.teachers.forEach((ws) => send(ws, msg));
  }

  function pushStudent(room, s) {
    send(s.ws, Object.assign({ t: 'me', status: room.engine.state.status, time: room.engine.state.time,
      duration: room.engine.cfg.durationSec, trackLength: room.engine.cfg.trackLength }, room.engine.me(s.id)));
  }

  function pushEvents(room, events) {
    events.forEach((ev) => {
      const s = room.students.get(ev.player);
      if (s) send(s.ws, Object.assign({ t: 'event' }, ev));
    });
  }

  function sendDoneToStudent(room, s) {
    const results = room.engine.results();
    const mine = results.find((r) => r.id === s.id);
    send(s.ws, {
      t: 'done', you: mine || null, total: results.length,
      top: results.slice(0, 3).map((r) => ({ rank: r.rank, name: r.name })),
    });
  }

  function finishRoom(room) {
    clearInterval(room.timer);
    room.timer = null;
    pushTeacher(room);
    room.students.forEach((s) => sendDoneToStudent(room, s));
  }

  function startLoop(room) {
    clearInterval(room.timer);
    let last = Date.now(), n = 0;
    room.timer = setInterval(() => {
      const t = Date.now();
      const dt = Math.min(0.5, (t - last) / 1000);
      last = t;
      const events = room.engine.tick(dt);
      pushEvents(room, events);
      if (room.engine.state.status === 'done') return finishRoom(room);
      if (++n % BROADCAST_EVERY === 0) {
        pushTeacher(room);
        room.students.forEach((s) => pushStudent(room, s));
      }
    }, TICK_MS);
  }

  function startRound(room) {
    room.engine.start();
    room.students.forEach((s) => {
      send(s.ws, { t: 'start', question: room.engine.questionFor(s.id) });
    });
    startLoop(room);
    pushTeacher(room);
  }

  // ---------------------------------------------------------------- WebSocket
  wss.on('connection', (ws) => {
    ws.ctx = null; // { role: 'teacher'|'student', room, studentId }

    ws.on('message', (raw) => {
      let m;
      try { m = JSON.parse(raw); } catch (e) { return; }
      if (!m || typeof m.t !== 'string') return;
      const ctx = ws.ctx;
      if (ctx) ctx.room.lastActive = Date.now();

      // ----- Lehrer: Raum anlegen / wieder verbinden
      if (m.t === 'create') {
        if (rooms.size >= MAX_ROOMS) return send(ws, { t: 'error', msg: 'Server ist ausgelastet.' });
        const vocab = parseVocab(m.vocab);
        if (!vocab) return send(ws, { t: 'error', msg: 'Das Set braucht mindestens 3 Vokabelpaare.' });
        const o = m.options || {};
        const options = {
          durationSec: clamp(o.durationMin, 1, 30, 5) * 60,
          trackLength: clamp(o.trackLength, 100, 600, 300),
          direction: o.direction === 'reverse' ? 'reverse' : 'forward',
          typoTolerance: o.typoTolerance !== false,
          maxPlayers: 35,
        };
        if (opts.engineOptions) Object.assign(options, opts.engineOptions);
        const room = {
          code: newCode(), teacherToken: token(), teachers: new Set([ws]), students: new Map(),
          engine: createEngine({ vocab, options, history: m.history }), vocabCount: vocab.length,
          timer: null, lastActive: Date.now(),
        };
        rooms.set(room.code, room);
        ws.ctx = { role: 'teacher', room };
        send(ws, { t: 'created', code: room.code, token: room.teacherToken });
        return pushTeacher(room);
      }
      if (m.t === 'teacher') {
        const room = rooms.get(String(m.code || '').toUpperCase());
        if (!room || room.teacherToken !== m.token) return send(ws, { t: 'error', msg: 'Raum nicht mehr vorhanden.', fatal: true });
        room.teachers.add(ws);
        ws.ctx = { role: 'teacher', room };
        send(ws, { t: 'created', code: room.code, token: room.teacherToken });
        return pushTeacher(room);
      }

      // ----- Schüler: beitreten / wieder verbinden
      if (m.t === 'join') {
        const room = rooms.get(String(m.code || '').trim().toUpperCase());
        if (!room) return send(ws, { t: 'error', msg: 'Diesen Code gibt es nicht.', field: 'code' });
        let s = null;
        if (m.resume) {
          s = [...room.students.values()].find((x) => x.token === m.resume);
          if (s) { if (s.ws && s.ws !== ws) s.ws.close(); s.ws = ws; }
        }
        if (!s) {
          const name = cleanName(m.name);
          if (!name) return send(ws, { t: 'error', msg: 'Bitte gib einen Namen ein.', field: 'name' });
          const id = token().slice(0, 8);
          const p = room.engine.addPlayer(id, name);
          if (!p) return send(ws, { t: 'error', msg: 'Der Raum ist voll (max. 35).', field: 'code' });
          s = { id, token: token(), ws };
          room.students.set(id, s);
        }
        room.engine.setConnected(s.id, true);
        ws.ctx = { role: 'student', room, studentId: s.id };
        const e = room.engine;
        send(ws, {
          t: 'joined', token: s.token, name: e.players.get(s.id).name, status: e.state.status,
          question: e.state.status === 'running' ? e.questionFor(s.id) : null,
        });
        if (e.state.status === 'done') sendDoneToStudent(room, s);
        pushStudent(room, s);
        return pushTeacher(room);
      }

      if (!ctx) return;
      const room = ctx.room;

      // ----- Lehrer-Befehle
      if (ctx.role === 'teacher') {
        if (m.t === 'start' && room.engine.state.status !== 'running') {
          if (room.engine.state.status === 'done') room.engine.reset();
          if (room.engine.players.size === 0) return send(ws, { t: 'error', msg: 'Noch niemand im Raum.' });
          startRound(room);
        } else if (m.t === 'end' && room.engine.state.status === 'running') {
          room.engine.end();
          finishRoom(room);
        } else if (m.t === 'again') {
          clearInterval(room.timer);
          room.engine.reset();
          room.students.forEach((s) => send(s.ws, { t: 'lobby' }));
          pushTeacher(room);
        } else if (m.t === 'kick') {
          const s = room.students.get(String(m.id));
          if (s) {
            send(s.ws, { t: 'kicked' });
            if (s.ws) s.ws.close();
            room.students.delete(s.id);
            room.engine.removePlayer(s.id);
            pushTeacher(room);
          }
        } else if (m.t === 'history') {
          send(ws, { t: 'history', history: room.engine.getHistory() });
        }
        return;
      }

      // ----- Schüler-Antwort
      if (ctx.role === 'student' && m.t === 'answer') {
        const s = room.students.get(ctx.studentId);
        const result = room.engine.submit(ctx.studentId, String(m.text || ''));
        if (!result || !s) return;
        send(ws, {
          t: 'result', correct: result.correct, almost: result.almost, expected: result.expected,
          question: result.question,
        });
        pushEvents(room, result.events);
        pushStudent(room, s);
        if (room.engine.state.status === 'done') finishRoom(room);
      }
    });

    ws.on('close', () => {
      const ctx = ws.ctx;
      if (!ctx) return;
      if (ctx.role === 'teacher') ctx.room.teachers.delete(ws);
      else {
        const s = ctx.room.students.get(ctx.studentId);
        if (s && s.ws === ws) {
          ctx.room.engine.setConnected(s.id, false);
          pushTeacher(ctx.room);
        }
      }
    });
  });

  // alte Räume aufräumen
  const sweeper = setInterval(() => {
    const cutoff = Date.now() - ROOM_TTL_MS;
    rooms.forEach((room, code) => {
      if (room.lastActive < cutoff) { clearInterval(room.timer); rooms.delete(code); }
    });
  }, 10 * 60 * 1000);
  sweeper.unref();

  return {
    server, rooms,
    listen: (port) => new Promise((resolve) => server.listen(port, () => resolve(server.address().port))),
    close: () => new Promise((resolve) => {
      clearInterval(sweeper);
      rooms.forEach((r) => clearInterval(r.timer));
      wss.clients.forEach((c) => c.terminate());
      wss.close(() => server.close(() => resolve()));
    }),
  };
}

module.exports = { createServer };

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port).then((p) => {
    console.log(`Word Race läuft auf http://localhost:${p}`);
    console.log('  Lehrer:  /teacher.html');
    console.log('  Schüler: /student.html');
  });
}
