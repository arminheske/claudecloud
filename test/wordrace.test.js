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
// Schwere Wörter geben stärkeren Boost als leichte
{
  const gain = (risk) => {
    const e = fresh(); e.setRisk(0, risk);
    const v = e.state.players[0].speed; right(e, 0);
    return e.state.players[0].speed - v;
  };
  assert.ok(gain(3) > gain(2) && gain(2) > gain(1));
  const e = fresh(); e.setRisk(0, 3); right(e, 0);
  assert.ok(e.state.players[0].boostT > 0);
}
// Risiko wählt Wörter der passenden Schwierigkeit; schwer bestraft härter
{
  const e = fresh(); e.setRisk(0, 3);
  assert.strictEqual(e.state.players[0].question.difficulty, 3);
  const pen = (risk) => { const f = fresh(); f.setRisk(0, risk); right(f, 0); const v = f.state.players[0].speed; wrong(f, 0); return f.state.players[0].speed / v; };
  assert.ok(pen(3) < pen(1));
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
// Zu wenig Vokabeln -> Fehler
assert.throws(() => WR.createEngine({ vocab: vocab.slice(0, 2) }));
console.log('alle Tests ok');
