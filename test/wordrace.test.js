const assert = require('assert');
const WR = require('../wordrace.js');

const vocab = [
  { id: 1, word: 'a', translation: 'A', difficulty: 1 },
  { id: 2, word: 'b', translation: 'B', difficulty: 1 },
  { id: 3, word: 'c', translation: 'C', difficulty: 2 },
  { id: 4, word: 'd', translation: 'D', difficulty: 2 },
  { id: 5, word: 'e', translation: 'E', difficulty: 3 },
  { id: 6, word: 'f', translation: 'F', difficulty: 3 },
];
const fresh = () => { const e = WR.createEngine({ vocab }); e.start(); return e; };
const right = (e, i) => e.answer(i, e.state.players[i].question.correctIndex);
const wrong = (e, i) => e.answer(i, (e.state.players[i].question.correctIndex + 1) % 3);

// Frage hat 3 verschiedene Optionen, richtige ist enthalten
{
  const e = fresh();
  const q = e.state.players[0].question;
  assert.strictEqual(new Set(q.options).size, 3);
  assert.ok(q.correctIndex >= 0);
}
// Richtig beschleunigt, falsch bremst
{
  const e = fresh();
  const v0 = e.state.players[0].speed;
  right(e, 0);
  assert.ok(e.state.players[0].speed > v0);
  const v1 = e.state.players[0].speed;
  wrong(e, 0);
  assert.ok(e.state.players[0].speed < v1);
  assert.ok(e.state.players[0].slowT > 0);
}
// Schwere Wörter geben stärkeren Boost und härtere Strafe als leichte
{
  const byDiff = (d) => {
    const e = fresh();
    const p = e.state.players[0];
    let q = p.question;
    for (let t = 0; t < 200 && q.difficulty !== d; t++) { wrong(e, 0); q = p.question; }
    assert.strictEqual(q.difficulty, d);
    p.speed = 10; p.slowT = 0; p.boostT = 0;
    right(e, 0);
    return { gain: p.speed - 10, boostT: p.boostT };
  };
  const g1 = byDiff(1), g2 = byDiff(2), g3 = byDiff(3);
  assert.ok(g3.gain > g2.gain && g2.gain > g1.gain);
  assert.ok(g3.boostT > 0 && g1.boostT === 0);
  const pen = (d) => {
    const e = fresh(); const p = e.state.players[0];
    for (let t = 0; t < 200 && p.question.difficulty !== d; t++) wrong(e, 0);
    p.speed = 20; wrong(e, 0); return p.speed / 20;
  };
  assert.ok(pen(3) < pen(1));
}
// Nächste Frage ist nie dasselbe Wort wie die vorige
{
  const e = fresh(); const p = e.state.players[0];
  for (let t = 0; t < 100; t++) { const id = p.question.id; right(e, 0); assert.notStrictEqual(p.question.id, id); }
}
// Fähigkeiten nach je 3 Richtigen: Abkürzung, Ölspur, Schild
{
  const e = fresh();
  const p0 = e.state.players[0];
  for (let k = 0; k < 3; k++) right(e, 0);
  assert.ok(e.drainEvents().some(x => x.type === 'ability' && x.ability === 'shortcut'));
  assert.ok(p0.pos >= 8);
  for (let k = 0; k < 3; k++) right(e, 0);
  assert.ok(e.state.players[1].slowT >= 3, 'Ölspur bremst Gegner');
  for (let k = 0; k < 3; k++) right(e, 0);
  assert.ok(p0.shield);
  wrong(e, 0);
  assert.ok(!p0.shield && p0.streak === 0);
}
// Schild blockt Ölspur des Gegners
{
  const e = fresh();
  const p1 = e.state.players[1]; p1.shield = true;
  for (let k = 0; k < 6; k++) right(e, 0);
  assert.strictEqual(p1.slowT, 0); assert.ok(!p1.shield);
}
// Rennen endet, Sieger wird bestimmt, danach keine Antworten mehr
{
  const e = fresh();
  for (let t = 0; t < 2000 && e.state.status === 'running'; t++) { right(e, 0); e.tick(0.1); }
  assert.strictEqual(e.state.status, 'done');
  assert.strictEqual(e.state.winner, 0);
  assert.strictEqual(e.answer(1, 0), null);
}
// Ohne difficulty: Schätzung nach Länge, immer eine Mischung aus allen Stufen
{
  const plain = ['cat', 'dog', 'house', 'water', 'to borrow', 'journey', 'reluctant', 'to endeavour', 'ubiquitous']
    .map((w, i) => ({ id: i, word: w, translation: 'T' + 'x'.repeat(i) }));
  const seen = new Set();
  const e = WR.createEngine({ vocab: plain }); e.start();
  const p = e.state.players[0];
  for (let t = 0; t < 300; t++) { seen.add(p.question.difficulty); wrong(e, 0); }
  assert.deepStrictEqual([...seen].sort(), [1, 2, 3]);
  // gleich lange Wörter -> trotzdem Mischung
  const same = ['a', 'b', 'c', 'd', 'e', 'f'].map((w, i) => ({ id: i, word: w, translation: w.toUpperCase() }));
  const e2 = WR.createEngine({ vocab: same }); e2.start();
  const seen2 = new Set();
  for (let t = 0; t < 300; t++) { seen2.add(e2.state.players[0].question.difficulty); wrong(e2, 0); }
  assert.strictEqual(seen2.size, 3);
}
// Verlauf: oft falsch -> schwerer, immer richtig -> leichter; History wird geliefert
{
  const v = [1, 2, 3].map((i) => ({ id: i, word: 'w' + i, translation: 'T' + i, difficulty: 2 }));
  const e = WR.createEngine({ vocab: v, history: { 1: { seen: 4, wrong: 3 }, 2: { seen: 5, wrong: 0 } } });
  e.start();
  const levels = {};
  const p = e.state.players[0];
  for (let t = 0; t < 100; t++) { if (!(p.question.id in levels)) levels[p.question.id] = p.question.difficulty; wrong(e, 0); }
  assert.strictEqual(levels[1], 3); assert.strictEqual(levels[2], 1);
  const h = e.getHistory();
  assert.ok(h[3].seen > 0 && h[3].wrong === h[3].seen);
  h[3].seen = 0; assert.ok(e.getHistory()[3].seen > 0, 'getHistory liefert eine Kopie');
}
// Ohne id: Index wird als id verwendet
{
  const e = WR.createEngine({ vocab: [{ word: 'a', translation: 'A' }, { word: 'b', translation: 'B' }, { word: 'c', translation: 'C' }] });
  e.start(); assert.ok(typeof e.state.players[0].question.id === 'number');
}
// Zu wenig Vokabeln -> Fehler
assert.throws(() => WR.createEngine({ vocab: vocab.slice(0, 2) }));
console.log('alle Tests ok');
