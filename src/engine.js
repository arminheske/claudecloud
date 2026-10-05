'use strict';
/*
 * Word Race – Spiel-Engine für eine Klasse (bis 35 SchülerInnen).
 * Läuft auf dem Server, kennt kein Netzwerk und kein DOM und ist deshalb gut testbar.
 *
 * Regeln:
 *  - Jede richtige Antwort beschleunigt, schwere Wörter stärker (und geben einen Boost).
 *  - Falsche Antwort: Tempo weg, kurze Verlangsamung, kleiner Rückschritt (bei schweren Wörtern größer).
 *  - 3 richtige in Folge -> Spezialfähigkeit (reihum): Abkürzung / Ölspur / Schild.
 *  - Schwierigkeit der Wörter ist nicht eingetragen, sie wird geschätzt:
 *    Startwert nach Länge der gesuchten Antwort (relativ zum Set), danach Anpassung
 *    an die echten Antworten (oft falsch -> schwerer, immer richtig -> leichter).
 */

const LEVELS = {
  1: { boost: 6, setback: 2, label: 'Leicht' },
  2: { boost: 9, setback: 3, label: 'Mittel' },
  3: { boost: 13, setback: 4, label: 'Schwer' },
};
const ABILITIES = ['shortcut', 'oil', 'shield'];

const DEFAULTS = {
  trackLength: 300,
  durationSec: 300,
  maxPlayers: 35,
  baseSpeed: 1,
  maxSpeed: 30,
  decay: 4, // Tempoverlust pro Sekunde bis zur Grundgeschwindigkeit
  direction: 'forward', // forward: Wort -> Übersetzung eingeben, reverse: umgekehrt
  typoTolerance: true,
  minAnswerMs: 150, // schützt vor Doppel-Enter
};

// ---------------------------------------------------------------- Antworten prüfen

function fold(s) {
  return String(s)
    .normalize('NFC')
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['’`´]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const LEAD = /^(der|die|das|ein|eine|the|a|an|to) /;

// Alle akzeptierten Schreibweisen einer eingetragenen Lösung.
// "Haus, Gebäude" -> beide; "(sich) erinnern" -> mit/ohne Klammer; Artikel / "to" dürfen fehlen.
function variants(expected) {
  const out = new Set();
  String(expected).split(/[\/;,]/).forEach((part) => {
    const forms = [part, part.replace(/\([^)]*\)/g, ' '), part.replace(/[()]/g, ' ')];
    forms.forEach((f) => {
      const v = fold(f);
      if (!v) return;
      out.add(v);
      const bare = v.replace(LEAD, '');
      if (bare && bare !== v) out.add(bare);
    });
  });
  return [...out];
}

function levenshtein(a, b) {
  if (a === b) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

// -> 'exact' | 'almost' (ein Tippfehler bei langen Wörtern ab 8 Buchstaben) | 'wrong'
function checkAnswer(input, expectedVariants, typoTolerance) {
  const f = fold(input);
  if (!f) return 'wrong';
  if (expectedVariants.includes(f)) return 'exact';
  if (typoTolerance && expectedVariants.some((v) => v.length >= 8 && levenshtein(f, v) <= 1)) return 'almost';
  return 'wrong';
}

// ---------------------------------------------------------------- Engine

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createEngine(opts) {
  const rng = opts.rng || Math.random;
  const now = opts.now || Date.now;
  const cfg = Object.assign({}, DEFAULTS, opts.options || {});
  const vocab = (opts.vocab || []).map((v, i) => ({
    id: v.id != null ? v.id : i,
    word: String(v.word),
    translation: String(v.translation),
  }));
  if (vocab.length < 3) throw new Error('Mindestens 3 Vokabeln nötig');

  const reverse = cfg.direction === 'reverse';
  const items = vocab.map((v) => {
    const prompt = reverse ? v.translation : v.word;
    const expected = reverse ? v.word : v.translation;
    return { id: v.id, prompt, expected, variants: variants(expected) };
  });

  // Verlauf (id -> {seen, wrong}), kann von früheren Runden übergeben werden
  const history = {};
  Object.keys(opts.history || {}).forEach((k) => {
    const h = opts.history[k] || {};
    history[k] = { seen: h.seen || 0, wrong: h.wrong || 0 };
  });

  // Startschätzung: Rang nach Länge der Lösung -> je ein Drittel leicht/mittel/schwer
  const startLevel = {};
  items
    .map((it) => ({
      id: it.id,
      score: it.expected.length + 3 * (it.expected.trim().split(/\s+/).length - 1),
    }))
    .sort((a, b) => a.score - b.score)
    .forEach((x, rank) => { startLevel[x.id] = 1 + Math.floor((rank * 3) / items.length); });

  function levelOf(it) {
    let d = startLevel[it.id];
    const h = history[it.id];
    if (h && h.seen >= 3) {
      const rate = h.wrong / h.seen;
      if (rate >= 0.5) d = Math.min(3, d + 1);
      else if (rate === 0) d = Math.max(1, d - 1);
    }
    return d;
  }

  const state = { status: 'lobby', time: 0, finishOrder: [] };
  const players = new Map();
  let joinCounter = 0;

  function ranking() {
    return [...players.values()].sort((a, b) => {
      const fa = a.finishedAt != null, fb = b.finishedAt != null;
      if (fa !== fb) return fa ? -1 : 1;
      if (fa) return a.finishedAt - b.finishedAt;
      return b.pos - a.pos || a.joined - b.joined;
    });
  }

  function resetPlayer(p) {
    Object.assign(p, {
      pos: 0, speed: cfg.baseSpeed, boostT: 0, slowT: 0, shield: false, streak: 0,
      abilityIdx: 0, correct: 0, wrong: 0, finishedAt: null, deck: [], q: null, askedAt: 0, lastAnswerAt: 0,
    });
  }

  function draw(p) {
    if (!p.deck.length) {
      p.deck = shuffle(items, rng);
      // gleiches Wort nicht zweimal direkt hintereinander
      if (p.q && p.deck[p.deck.length - 1].id === p.q.id) p.deck.unshift(p.deck.pop());
    }
    const it = p.deck.pop();
    p.q = { id: it.id, prompt: it.prompt, expected: it.expected, variants: it.variants, level: levelOf(it) };
    p.askedAt = now();
    return publicQuestion(p);
  }

  function publicQuestion(p) {
    return p.q ? { prompt: p.q.prompt, level: p.q.level } : null;
  }

  function addPlayer(id, name) {
    if (players.size >= cfg.maxPlayers) return null;
    let unique = name, n = 2;
    const taken = () => [...players.values()].some((p) => p.name.toLowerCase() === unique.toLowerCase());
    while (taken()) unique = `${name} (${n++})`;
    const p = { id, name: unique, joined: joinCounter++, connected: true };
    resetPlayer(p);
    players.set(id, p);
    if (state.status === 'running') draw(p);
    return p;
  }

  function removePlayer(id) { players.delete(id); }

  function setConnected(id, connected) {
    const p = players.get(id);
    if (p) p.connected = connected;
  }

  function start() {
    state.status = 'running';
    state.time = 0;
    state.finishOrder = [];
    players.forEach((p) => { resetPlayer(p); draw(p); });
  }

  function reset() {
    state.status = 'lobby';
    state.time = 0;
    state.finishOrder = [];
    players.forEach((p) => resetPlayer(p));
  }

  function end() {
    if (state.status === 'running') state.status = 'done';
  }

  function checkEnd() {
    if (state.status !== 'running') return;
    const active = [...players.values()].filter((p) => p.connected);
    const allDone = active.length > 0 && active.every((p) => p.finishedAt != null);
    if (state.time >= cfg.durationSec || allDone) state.status = 'done';
  }

  function finishIfAtGoal(p, events) {
    if (p.finishedAt == null && p.pos >= cfg.trackLength) {
      p.pos = cfg.trackLength;
      p.finishedAt = state.time;
      state.finishOrder.push(p.id);
      events.push({ player: p.id, type: 'finish', place: state.finishOrder.length });
    }
  }

  function tick(dt) {
    const events = [];
    if (state.status !== 'running') return events;
    state.time += dt;
    players.forEach((p) => {
      if (!p.connected || p.finishedAt != null) return;
      p.speed = Math.max(cfg.baseSpeed, p.speed - cfg.decay * dt);
      const mult = (p.boostT > 0 ? 1.5 : 1) * (p.slowT > 0 ? 0.3 : 1);
      p.boostT = Math.max(0, p.boostT - dt);
      p.slowT = Math.max(0, p.slowT - dt);
      p.pos = Math.min(cfg.trackLength, p.pos + p.speed * mult * dt);
      finishIfAtGoal(p, events);
    });
    checkEnd();
    return events;
  }

  function grantAbility(p, events) {
    const ability = ABILITIES[p.abilityIdx++ % ABILITIES.length];
    if (ability === 'shortcut') {
      p.pos = Math.min(cfg.trackLength, p.pos + cfg.trackLength * 0.07);
      finishIfAtGoal(p, events);
    } else if (ability === 'shield') {
      p.shield = true;
    } else {
      // Ölspur: trifft die beste noch fahrende Person (außer dir selbst), die nicht schon ausgebremst ist
      const target = ranking().find((o) => o !== p && o.finishedAt == null && o.slowT <= 0.5);
      if (target) {
        if (target.shield) {
          target.shield = false;
          events.push({ player: target.id, type: 'shield-block', by: p.name });
        } else {
          target.slowT = Math.max(target.slowT, 3);
          events.push({ player: target.id, type: 'oiled', by: p.name });
        }
      }
    }
    events.push({ player: p.id, type: 'ability', ability });
  }

  // -> null (Antwort ignoriert) oder Ergebnis der Antwort
  function submit(id, text) {
    const p = players.get(id);
    if (!p || state.status !== 'running' || p.finishedAt != null || !p.q) return null;
    const t = now();
    if (t - p.lastAnswerAt < cfg.minAnswerMs) return null;
    p.lastAnswerAt = t;

    const q = p.q, lv = LEVELS[q.level], events = [];
    const verdict = checkAnswer(String(text).slice(0, 200), q.variants, cfg.typoTolerance);
    const correct = verdict !== 'wrong';
    const h = history[q.id] || (history[q.id] = { seen: 0, wrong: 0 });
    h.seen++;

    if (correct) {
      p.correct++;
      p.speed = Math.min(cfg.maxSpeed, p.speed + lv.boost);
      if (q.level === 3) p.boostT = 2;
      p.streak++;
      events.push({ player: p.id, type: 'correct', level: q.level });
      if (p.streak % 3 === 0) grantAbility(p, events);
      finishIfAtGoal(p, events);
    } else {
      h.wrong++;
      p.wrong++;
      p.streak = 0;
      if (p.shield) {
        p.shield = false;
        events.push({ player: p.id, type: 'shield-block' });
      } else {
        p.speed = cfg.baseSpeed;
        p.boostT = 0;
        p.slowT = 1 + q.level;
        p.pos = Math.max(0, p.pos - lv.setback);
        events.push({ player: p.id, type: 'wrong', level: q.level });
      }
    }
    const result = {
      correct,
      almost: verdict === 'almost',
      expected: verdict === 'exact' ? null : q.expected,
      events,
    };
    result.question = p.finishedAt != null ? null : draw(p);
    checkEnd();
    return result;
  }

  function me(id) {
    const p = players.get(id);
    if (!p) return null;
    const rank = ranking().indexOf(p) + 1;
    return {
      pos: round1(p.pos), rank, total: players.size, speed: effSpeed(p), boost: p.boostT > 0,
      slow: p.slowT > 0, shield: p.shield, streak: p.streak, correct: p.correct, wrong: p.wrong,
      finished: p.finishedAt != null,
    };
  }

  function effSpeed(p) {
    return round1(p.speed * (p.boostT > 0 ? 1.5 : 1) * (p.slowT > 0 ? 0.3 : 1));
  }
  function round1(x) { return Math.round(x * 10) / 10; }

  function publicPlayers() {
    const rank = new Map(ranking().map((p, i) => [p.id, i + 1]));
    return [...players.values()]
      .sort((a, b) => a.joined - b.joined)
      .map((p) => ({
        id: p.id, name: p.name, pos: round1(p.pos), rank: rank.get(p.id), speed: effSpeed(p),
        boost: p.boostT > 0, slow: p.slowT > 0, shield: p.shield, streak: p.streak,
        correct: p.correct, wrong: p.wrong, finished: p.finishedAt != null, connected: p.connected,
      }));
  }

  function results() {
    return ranking().map((p, i) => ({
      rank: i + 1, id: p.id, name: p.name, finished: p.finishedAt != null,
      time: p.finishedAt != null ? round1(p.finishedAt) : null,
      pos: round1(p.pos), correct: p.correct, wrong: p.wrong,
    }));
  }

  function getHistory() { return JSON.parse(JSON.stringify(history)); }
  function questionFor(id) { const p = players.get(id); return p ? publicQuestion(p) : null; }

  return {
    cfg, state, LEVELS, addPlayer, removePlayer, setConnected, start, reset, end, tick, submit,
    me, publicPlayers, results, getHistory, questionFor, players,
  };
}

module.exports = { createEngine, fold, variants, checkAnswer, levenshtein, LEVELS, DEFAULTS };
