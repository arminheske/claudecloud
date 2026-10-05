const assert = require('assert');
const { createEngine, fold, variants, checkAnswer } = require('../src/engine');

// ---- Antworten prüfen
assert.strictEqual(fold('  Müde! '), 'muede');
assert.strictEqual(fold('müde'), 'muede'); // zerlegtes ü (macOS)
assert.strictEqual(fold("Don't"), 'dont');
const ok = (inp, exp, typo = true) => checkAnswer(inp, variants(exp), typo);
assert.strictEqual(ok('muede', 'müde'), 'exact');
assert.strictEqual(ok('MÜDE', 'müde'), 'exact');
assert.strictEqual(ok('schon', 'schön'), 'wrong', 'schon != schön');
assert.strictEqual(ok('Hund', 'der Hund'), 'exact', 'Artikel darf fehlen');
assert.strictEqual(ok('der Hund', 'der Hund'), 'exact');
assert.strictEqual(ok('die Hund', 'der Hund'), 'wrong', 'falscher Artikel ist falsch');
assert.strictEqual(ok('borrow', 'to borrow'), 'exact');
assert.strictEqual(ok('Gebäude', 'Haus, Gebäude'), 'exact', 'mehrere Lösungen');
assert.strictEqual(ok('erinnern', '(sich) erinnern'), 'exact');
assert.strictEqual(ok('sich erinnern', '(sich) erinnern'), 'exact');
assert.strictEqual(ok('widerwilig', 'widerwillig'), 'almost', 'ein Tippfehler bei langen Wörtern');
assert.strictEqual(ok('widerwilig', 'widerwillig', false), 'wrong');
assert.strictEqual(ok('Maus', 'Haus'), 'wrong', 'kurze Wörter ohne Toleranz');
assert.strictEqual(ok('', 'Haus'), 'wrong');

// ---- Engine
const vocab = [
  ['cat', 'Katze'], ['dog', 'Hund'], ['house', 'Haus'], ['water', 'Wasser'], ['to borrow', 'ausleihen'],
  ['journey', 'Reise'], ['tired', 'müde'], ['to achieve', 'erreichen'], ['reluctant', 'widerwillig'],
  ['ubiquitous', 'allgegenwärtig'], ['scarcity', 'Knappheit'],
].map(([word, translation]) => ({ word, translation }));
const mk = (options, o2) => createEngine(Object.assign({ vocab, options: Object.assign({ minAnswerMs: 0 }, options) }, o2));
const solution = (e) => Object.fromEntries(vocab.map((v) => [v.word, v.translation]));
const answerRight = (e, id) => e.submit(id, solution()[e.players.get(id).q.prompt]);
const answerWrong = (e, id) => e.submit(id, 'xxxxxxxx-falsch');

// max. 35, Namen eindeutig
{
  const e = mk();
  for (let i = 0; i < 35; i++) assert.ok(e.addPlayer('p' + i, 'Max'));
  assert.strictEqual(e.addPlayer('p35', 'Zu viel'), null);
  const names = new Set(e.publicPlayers().map((p) => p.name));
  assert.strictEqual(names.size, 35);
}
// Antworten nur im laufenden Spiel
{
  const e = mk(); e.addPlayer('a', 'A');
  assert.strictEqual(e.submit('a', 'x'), null);
  e.start();
  assert.ok(e.submit('a', 'x'));
}
// Richtig beschleunigt, falsch bremst und wirft zurück; Lösung wird nur bei Fehler verraten
{
  const e = mk(); e.addPlayer('a', 'A'); e.start();
  const p = e.players.get('a');
  const v0 = p.speed;
  const r = answerRight(e, 'a');
  assert.ok(r.correct && r.expected === null && p.speed > v0);
  e.tick(1);
  const before = p.pos;
  const w = answerWrong(e, 'a');
  assert.ok(!w.correct && typeof w.expected === 'string');
  assert.ok(p.pos < before && p.slowT > 0 && p.speed === e.cfg.baseSpeed);
  assert.strictEqual(p.streak, 0);
}
// schwere Wörter: stärkerer Boost und härtere Strafe
{
  const gain = (level) => {
    const e = mk(); e.addPlayer('a', 'A'); e.start();
    const p = e.players.get('a');
    for (let t = 0; t < 500 && p.q.level !== level; t++) answerWrong(e, 'a');
    assert.strictEqual(p.q.level, level);
    p.speed = 5; p.pos = 50; p.slowT = 0; p.boostT = 0;
    answerRight(e, 'a');
    return { dv: p.speed - 5, boost: p.boostT };
  };
  const g = [1, 2, 3].map(gain);
  assert.ok(g[2].dv > g[1].dv && g[1].dv > g[0].dv);
  assert.ok(g[2].boost > 0 && g[0].boost === 0);
  const loss = (level) => {
    const e = mk(); e.addPlayer('a', 'A'); e.start();
    const p = e.players.get('a');
    for (let t = 0; t < 500 && p.q.level !== level; t++) answerWrong(e, 'a');
    p.pos = 50; const b = p.pos; answerWrong(e, 'a'); return b - p.pos;
  };
  assert.ok(loss(3) > loss(1));
}
// Schätzung: immer alle drei Stufen im Set; Verlauf passt Stufe an
{
  const e = mk(); e.addPlayer('a', 'A'); e.start();
  const seen = new Set(); const p = e.players.get('a');
  for (let t = 0; t < 200; t++) { seen.add(p.q.level); answerRight(e, 'a'); }
  assert.deepStrictEqual([...seen].sort(), [1, 2, 3]);
  const e2 = mk({}, { history: { 0: { seen: 4, wrong: 3 } } }); // 'cat' war oft falsch
  const e3 = mk();
  e2.addPlayer('a', 'A'); e3.addPlayer('a', 'A'); e2.start(); e3.start();
  const lvl = (e) => { const p = e.players.get('a'); for (let t = 0; t < 100; t++) { if (p.q.prompt === 'cat') return p.q.level; answerRight(e, 'a'); } };
  // history nutzt ids -> 'cat' hat id 0
  assert.ok(lvl(e2) >= lvl(e3));
  assert.ok(typeof e2.getHistory()[0].seen === 'number');
}
// Richtung umkehren: englisches Wort eintippen
{
  const e = mk({ direction: 'reverse' }); e.addPlayer('a', 'A'); e.start();
  const p = e.players.get('a');
  const eng = vocab.find((v) => v.translation === p.q.prompt).word;
  assert.ok(e.submit('a', eng).correct);
}
// Fähigkeiten: 3 richtig -> Abkürzung, 6 -> Ölspur trifft Führenden, 9 -> Schild
{
  const e = mk(); e.addPlayer('a', 'A'); e.addPlayer('b', 'B'); e.addPlayer('c', 'C'); e.start();
  const [a, b] = ['a', 'b'].map((id) => e.players.get(id));
  b.pos = 80; // B führt
  for (let i = 0; i < 3; i++) answerRight(e, 'a');
  assert.ok(a.pos >= e.cfg.trackLength * 0.07);
  for (let i = 0; i < 3; i++) answerRight(e, 'a');
  assert.ok(b.slowT >= 3, 'Ölspur trifft den Führenden');
  for (let i = 0; i < 3; i++) answerRight(e, 'a');
  assert.ok(a.shield);
  answerWrong(e, 'a');
  assert.ok(!a.shield && a.streak === 0);
}
// Schild blockt Ölspur
{
  const e = mk(); e.addPlayer('a', 'A'); e.addPlayer('b', 'B'); e.start();
  const b = e.players.get('b'); b.pos = 90; b.shield = true;
  for (let i = 0; i < 6; i++) answerRight(e, 'a');
  assert.strictEqual(b.slowT, 0); assert.ok(!b.shield);
}
// Ziel, Reihenfolge, Rundenende; getrennte Spieler werden eingefroren und blockieren das Ende nicht
{
  const e = mk({ trackLength: 60 }); e.addPlayer('a', 'A'); e.addPlayer('b', 'B'); e.addPlayer('c', 'C'); e.start();
  e.setConnected('c', false);
  for (let t = 0; t < 2000 && e.state.status === 'running'; t++) {
    answerRight(e, 'a'); if (t % 2) answerRight(e, 'b'); e.tick(0.5);
  }
  assert.strictEqual(e.state.status, 'done');
  const res = e.results();
  assert.deepStrictEqual(res.slice(0, 2).map((r) => r.id), ['a', 'b']);
  assert.ok(res[0].finished && res[0].time <= res[1].time);
  assert.strictEqual(e.players.get('c').pos, 0);
}
// Zeitlimit beendet die Runde, Neustart setzt zurück
{
  const e = mk({ durationSec: 5 }); e.addPlayer('a', 'A'); e.start();
  for (let i = 0; i < 100; i++) e.tick(0.1);
  assert.strictEqual(e.state.status, 'done');
  e.reset(); assert.strictEqual(e.state.status, 'lobby'); assert.strictEqual(e.players.get('a').pos, 0);
}
// Doppel-Enter wird ignoriert
{
  let t = 0;
  const e = createEngine({ vocab, now: () => t, options: { minAnswerMs: 200 } });
  e.addPlayer('a', 'A'); e.start(); t = 1000;
  assert.ok(answerRight(e, 'a')); t = 1050;
  assert.strictEqual(answerRight(e, 'a'), null); t = 1300;
  assert.ok(answerRight(e, 'a'));
}
// Wort wird nicht direkt wiederholt, alle Wörter kommen dran
{
  const e = mk(); e.addPlayer('a', 'A'); e.start();
  const p = e.players.get('a'); const seen = new Set(); let last = null;
  for (let i = 0; i < vocab.length * 3; i++) { assert.notStrictEqual(p.q.id, last); last = p.q.id; seen.add(p.q.id); answerWrong(e, 'a'); }
  assert.strictEqual(seen.size, vocab.length);
}
assert.throws(() => createEngine({ vocab: vocab.slice(0, 2) }));
console.log('Engine-Tests ok');

// ---- Tempo-Simulation: 35 SchülerInnen mit unterschiedlicher Stärke
if (process.argv.includes('--sim')) {
  const speeds = [];
  const e = mk({ durationSec: 600 });
  for (let i = 0; i < 35; i++) e.addPlayer('s' + i, 'S' + i);
  e.start();
  const skill = {}; const next = {};
  e.players.forEach((p, id) => { skill[id] = 0.45 + 0.5 * Math.random(); next[id] = 5 + Math.random() * 8; });
  for (let t = 0; e.state.status === 'running'; t += 0.1) {
    e.tick(0.1);
    e.players.forEach((p, id) => {
      if (p.finishedAt != null || t < next[id]) return;
      (Math.random() < skill[id] ? answerRight : answerWrong)(e, id);
      next[id] = t + 5 + Math.random() * 10; // 5-15 s pro Wort
    });
  }
  const r = e.results();
  console.log('Rundenende nach', Math.round(e.state.time), 's; im Ziel:', r.filter((x) => x.finished).length, '/ 35');
  console.log('Siegerzeit', r[0].time, 's; Median Zielzeit', r.filter((x) => x.finished)[Math.floor(r.filter((x) => x.finished).length / 2)]?.time);
}
