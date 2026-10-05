const assert = require('assert');
const WebSocket = require('ws');
const http = require('http');
const { createServer } = require('../server');

const vocab = [
  ['cat', 'Katze'], ['dog', 'Hund'], ['house', 'Haus'], ['water', 'Wasser'], ['to borrow', 'ausleihen'],
  ['journey', 'Reise'], ['tired', 'müde'], ['to achieve', 'erreichen'], ['reluctant', 'widerwillig'],
].map(([word, translation]) => ({ word, translation }));
const solution = Object.fromEntries(vocab.map((v) => [v.word, v.translation]));

function client(port) {
  const ws = new WebSocket('ws://localhost:' + port);
  const c = { ws, msgs: [], waiters: [] };
  ws.on('message', (d) => {
    const m = JSON.parse(d); c.msgs.push(m);
    c.waiters = c.waiters.filter((w) => !(w.pred(m) && (w.res(m), true)));
  });
  c.opened = new Promise((r) => ws.on('open', r));
  c.send = (m) => ws.send(JSON.stringify(m));
  c.wait = (pred, ms = 4000) => {
    const found = c.msgs.find(pred);
    if (found) return Promise.resolve(found);
    return new Promise((res, rej) => {
      c.waiters.push({ pred, res });
      setTimeout(() => rej(new Error('Timeout')), ms);
    });
  };
  c.last = (t) => [...c.msgs].reverse().find((m) => m.t === t);
  return c;
}
const get = (port, p) => new Promise((res) => http.get({ port, path: p }, (r) => { let b = ''; r.on('data', (d) => (b += d)); r.on('end', () => res({ status: r.statusCode, body: b })); }));

(async () => {
  const srv = createServer({ engineOptions: { minAnswerMs: 0, trackLength: 100, baseSpeed: 3 } });
  const port = await srv.listen(0);

  // statische Dateien, Pfad-Traversal blockiert
  assert.strictEqual((await get(port, '/teacher.html')).status, 200);
  assert.strictEqual((await get(port, '/student.html')).status, 200);
  assert.notStrictEqual((await get(port, '/../server.js')).status, 200);
  assert.notStrictEqual((await get(port, '/%2e%2e/server.js')).status, 200);

  // Lehrer legt Raum an
  const teacher = client(port); await teacher.opened;
  teacher.send({ t: 'create', vocab: [{ word: 'a', translation: 'b' }] });
  assert.ok((await teacher.wait((m) => m.t === 'error')).msg.includes('mindestens 3'));
  teacher.send({ t: 'create', vocab, options: { durationMin: 2 } });
  const created = await teacher.wait((m) => m.t === 'created');
  assert.match(created.code, /^[A-Z2-9]{5}$/);
  const code = created.code;

  // falsche Codes / leere Namen
  const bad = client(port); await bad.opened;
  bad.send({ t: 'join', code: 'ZZZZZ', name: 'X' });
  assert.ok((await bad.wait((m) => m.t === 'error')).msg.includes('Code'));
  bad.send({ t: 'join', code, name: '  <b> ' });
  await bad.wait((m) => m.t === 'joined'); // Name wird bereinigt ("b")
  assert.strictEqual(bad.last('joined').name, 'b');

  // 35 SchülerInnen, der 36. wird abgewiesen
  const kids = [];
  for (let i = 0; i < 34; i++) {
    const k = client(port); await k.opened; k.send({ t: 'join', code: code.toLowerCase(), name: 'Kind' + i });
    await k.wait((m) => m.t === 'joined'); kids.push(k);
  }
  const extra = client(port); await extra.opened; extra.send({ t: 'join', code, name: 'Zuviel' });
  assert.ok((await extra.wait((m) => m.t === 'error')).msg.includes('voll'));
  const lobby = [...teacher.msgs].reverse().find((m) => m.t === 'state');
  assert.strictEqual(lobby.players.length, 35);
  assert.strictEqual(lobby.status, 'lobby');
  const all = [bad, ...kids];

  // Schüler dürfen nicht starten
  kids[0].send({ t: 'start' });
  await new Promise((r) => setTimeout(r, 150));
  assert.ok(!all.some((k) => k.last('start')));

  // Start: alle bekommen eine Frage, aber ohne Lösung
  teacher.send({ t: 'start' });
  for (const k of all) {
    const s = await k.wait((m) => m.t === 'start');
    assert.ok(s.question.prompt in solution);
    assert.deepStrictEqual(Object.keys(s.question).sort(), ['level', 'prompt']);
  }

  // Alle spielen: richtig antworten, eine/r absichtlich falsch
  const bot = async (k, wrongFirst) => {
    let q = k.last('start').question;
    if (wrongFirst) {
      k.send({ t: 'answer', text: 'komplett falsch' });
      const r = await k.wait((m) => m.t === 'result' && !m.correct);
      assert.ok(r.expected, 'Lösung wird bei Fehler gezeigt');
      q = r.question;
    }
    for (let n = 0; n < 200; n++) {
      if (k.last('me') && k.last('me').finished) return;
      const before = k.msgs.filter((m) => m.t === 'result').length;
      k.send({ t: 'answer', text: solution[q.prompt] });
      await k.wait((m) => m.t === 'result' && k.msgs.filter((x) => x.t === 'result').length > before).then((r) => { q = r.question; }).catch(() => {});
      if (!q) return;
      await new Promise((r) => setTimeout(r, 5));
    }
  };
  await Promise.all(all.map((k, i) => bot(k, i === 0)));

  // Runde zu Ende: Lehrer sieht Ergebnis, Schüler 'done'
  const done = await teacher.wait((m) => m.t === 'state' && m.status === 'done', 15000);
  assert.strictEqual(done.results.length, 35);
  assert.ok(done.results[0].finished && done.results[0].rank === 1);
  for (const k of all) await k.wait((m) => m.t === 'done');
  const myDone = all[5].last('done');
  assert.ok(myDone.you && myDone.top.length === 3);

  // Verlauf wird geliefert; neue Runde
  teacher.send({ t: 'history' });
  const hist = await teacher.wait((m) => m.t === 'history');
  assert.ok(Object.keys(hist.history).length > 0);
  teacher.send({ t: 'again' });
  await all[3].wait((m) => m.t === 'lobby');

  // Wiederverbinden mit Token
  const k = kids[0];
  const token = k.last('joined').token;
  k.ws.close();
  const re = client(port); await re.opened;
  re.send({ t: 'join', code, resume: token });
  const rej = await re.wait((m) => m.t === 'joined');
  assert.strictEqual(rej.name, 'Kind0');
  const st = [...teacher.msgs].reverse().find((m) => m.t === 'state');
  await new Promise((r) => setTimeout(r, 100));
  assert.strictEqual([...teacher.msgs].reverse().find((m) => m.t === 'state').players.length, 35);

  // Lehrer-Reconnect mit Token, falsches Token abgelehnt
  const t2 = client(port); await t2.opened;
  t2.send({ t: 'teacher', code, token: 'falsch' });
  assert.ok((await t2.wait((m) => m.t === 'error')).fatal);
  t2.send({ t: 'teacher', code, token: created.token });
  await t2.wait((m) => m.t === 'created');

  console.log('Server-Tests ok');
  await srv.close();
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
