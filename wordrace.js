/*
 * Word Race – Vokabel-Minispiel für zwei Spieler an einem Gerät.
 *
 * Einbinden:
 *   <script src="wordrace.js"></script>
 *   const game = WordRace.create(document.getElementById('box'), {
 *     vocab: [{ id: 1, word: 'cat', translation: 'Katze', difficulty: 1 }, ...],
 *     onAnswer: ({ player, wordId, correct }) => {},   // z.B. Lernfortschritt speichern
 *     onFinish: ({ winner, stats }) => {},
 *   });
 *   game.destroy();  // räumt DOM und Tastatur-Listener auf
 *
 * vocab: mind. 3 Einträge, difficulty 1 (leicht) bis 3 (schwer):
 * schwere Wörter geben mehr Boost, bestrafen Fehler aber auch härter.
 * Die Spiellogik (WordRace.createEngine) ist unabhängig vom DOM und testbar.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WordRace = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TRACK_LENGTH = 120;
  var BASE_SPEED = 6;
  var MAX_SPEED = 28;
  var DECAY = 3; // Geschwindigkeitsverlust pro Sekunde bis zur Reisegeschwindigkeit
  var ABILITIES = ['shortcut', 'oil', 'shield'];
  var DIFFICULTY = {
    1: { boost: 5, penalty: 0.6, label: 'Leicht' },
    2: { boost: 8, penalty: 0.45, label: 'Mittel' },
    3: { boost: 12, penalty: 0.3, label: 'Schwer' },
  };

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function createEngine(opts) {
    var vocab = opts.vocab || [];
    var rng = opts.rng || Math.random;
    if (vocab.length < 3) throw new Error('WordRace: mindestens 3 Vokabeln nötig');

    var state = { status: 'ready', winner: null, time: 0, events: [], players: [] };

    function newPlayer() {
      return {
        pos: 0, speed: BASE_SPEED, boostT: 0, slowT: 0, shield: false,
        streak: 0, abilityIdx: 0, question: null, correct: 0, wrong: 0,
      };
    }

    function pickQuestion(p) {
      var last = p.question && p.question.id;
      var pool = vocab.filter(function (v) { return v.id !== last; });
      var w = pool[Math.floor(rng() * pool.length)];
      var others = vocab.filter(function (v) { return v.translation !== w.translation; });
      var distractors = shuffle(others, rng).slice(0, 2).map(function (v) { return v.translation; });
      var options = shuffle([w.translation].concat(distractors), rng);
      p.question = {
        id: w.id, word: w.word, options: options,
        correctIndex: options.indexOf(w.translation), difficulty: w.difficulty || 2,
      };
    }

    function emit(player, type, extra) {
      var e = { player: player, type: type };
      for (var k in extra) e[k] = extra[k];
      state.events.push(e);
    }

    function grantAbility(i) {
      var p = state.players[i], o = state.players[1 - i];
      var ability = ABILITIES[p.abilityIdx++ % ABILITIES.length];
      if (ability === 'shortcut') {
        p.pos = Math.min(TRACK_LENGTH, p.pos + 8);
      } else if (ability === 'oil') {
        if (o.shield) { o.shield = false; emit(1 - i, 'shield-block', {}); }
        else o.slowT = Math.max(o.slowT, 3);
      } else {
        p.shield = true;
      }
      emit(i, 'ability', { ability: ability });
    }

    function start() {
      state.players = [newPlayer(), newPlayer()];
      state.players.forEach(pickQuestion);
      state.status = 'running';
      state.winner = null;
      state.time = 0;
      state.events = [];
    }

    function answer(i, optionIndex) {
      if (state.status !== 'running') return null;
      var p = state.players[i], q = p.question, r = DIFFICULTY[q.difficulty];
      var correct = optionIndex === q.correctIndex;
      if (correct) {
        p.correct++;
        p.speed = Math.min(MAX_SPEED, p.speed + r.boost);
        if (q.difficulty === 3) p.boostT = 2;
        p.streak++;
        emit(i, 'correct', { difficulty: q.difficulty });
        if (p.streak % 3 === 0) grantAbility(i);
      } else {
        p.wrong++;
        p.streak = 0;
        if (p.shield) { p.shield = false; emit(i, 'shield-block', {}); }
        else {
          p.speed = Math.max(BASE_SPEED * 0.5, p.speed * r.penalty);
          p.slowT = 1 + q.difficulty * 0.5;
          emit(i, 'wrong', { difficulty: q.difficulty });
        }
      }
      var result = { player: i, wordId: q.id, correct: correct };
      pickQuestion(p);
      return result;
    }

    function tick(dt) {
      if (state.status !== 'running') return;
      state.time += dt;
      state.players.forEach(function (p, i) {
        p.speed = Math.max(BASE_SPEED, p.speed - DECAY * dt);
        var mult = (p.boostT > 0 ? 1.6 : 1) * (p.slowT > 0 ? 0.4 : 1);
        p.boostT = Math.max(0, p.boostT - dt);
        p.slowT = Math.max(0, p.slowT - dt);
        p.pos = Math.min(TRACK_LENGTH, p.pos + p.speed * mult * dt);
      });
      var done = state.players
        .map(function (p, i) { return { i: i, pos: p.pos }; })
        .filter(function (x) { return x.pos >= TRACK_LENGTH; });
      if (done.length) {
        // Gleichstand im selben Tick: wer näher am Ziel war (hier gleich) -> Spieler 1 nicht bevorzugen
        state.winner = done.length === 2 ? -1 : done[0].i;
        state.status = 'done';
      }
    }

    function drainEvents() {
      var e = state.events; state.events = []; return e;
    }

    return {
      state: state, start: start, tick: tick, answer: answer,
      drainEvents: drainEvents, TRACK_LENGTH: TRACK_LENGTH, DIFFICULTY: DIFFICULTY,
    };
  }

  // ---------------------------------------------------------------- UI

  var CSS = [
    '.wr{font-family:system-ui,sans-serif;max-width:900px;margin:0 auto;color:#1a1a2e}',
    '.wr canvas{width:100%;display:block;border-radius:12px;background:#2b2d42}',
    '.wr-panels{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}',
    '.wr-panel{border:2px solid #ddd;border-radius:12px;padding:12px;background:#fff}',
    '.wr-panel.p0{border-color:#ef476f}.wr-panel.p1{border-color:#118ab2}',
    '.wr-word{font-size:1.6rem;font-weight:700;margin:6px 0 10px}',
    '.wr-opt,.wr-btn{display:block;width:100%;margin:6px 0;padding:10px;font-size:1rem;',
    'border:2px solid #ccc;border-radius:8px;background:#f8f8fb;cursor:pointer;text-align:left}',
    '.wr-opt:hover,.wr-btn:hover{background:#eef}',
    '.wr-opt kbd{display:inline-block;min-width:1.4em;margin-right:8px;padding:0 4px;',
    'border:1px solid #999;border-radius:4px;background:#fff;text-align:center;font-size:.85rem}',
    '.wr-stars{font-size:.9rem;color:#888;margin-top:-6px;margin-bottom:6px}',
    '.wr-status{min-height:1.4em;font-size:.95rem;margin-top:6px}',
    '.wr-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;',
    'justify-content:center;background:rgba(0,0,0,.55);color:#fff;border-radius:12px;text-align:center;font-size:2rem}',
    '.wr-overlay .wr-btn{width:auto;margin-top:16px;padding:10px 24px}',
  ].join('');

  var KEYS = [
    { answers: ['1', '2', '3'] },
    { answers: ['8', '9', '0'] },
  ];
  var NAMES = ['Spieler 1', 'Spieler 2'];
  var COLORS = ['#ef476f', '#118ab2'];
  var ABILITY_TEXT = {
    shortcut: '🌀 Abkürzung!', oil: '🛢️ Ölspur!', shield: '🛡️ Schild!',
  };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function create(container, opts) {
    if (!document.getElementById('wr-style')) {
      var style = el('style'); style.id = 'wr-style'; style.textContent = CSS;
      document.head.appendChild(style);
    }
    var engine = createEngine(opts);
    var wrap = el('div', 'wr');
    var stage = el('div'); stage.style.position = 'relative';
    var canvas = el('canvas'); canvas.width = 900; canvas.height = 220;
    var overlay = el('div', 'wr-overlay'); overlay.style.display = 'none';
    stage.appendChild(canvas); stage.appendChild(overlay);
    var panelsEl = el('div', 'wr-panels');
    wrap.appendChild(stage); wrap.appendChild(panelsEl);
    container.appendChild(wrap);

    var ctx = canvas.getContext('2d');
    var ui = [0, 1].map(function (i) {
      var panel = el('div', 'wr-panel p' + i);
      var title = el('div', null, NAMES[i]); title.style.fontWeight = '700';
      var word = el('div', 'wr-word');
      var optBtns = [0, 1, 2].map(function (k) {
        var b = el('button', 'wr-opt');
        b.addEventListener('click', function () { handleAnswer(i, k); });
        return b;
      });
      var stars = el('div', 'wr-stars');
      var status = el('div', 'wr-status');
      [title, word, stars].concat(optBtns, [status]).forEach(function (n) { panel.appendChild(n); });
      panelsEl.appendChild(panel);
      return { word: word, stars: stars, opts: optBtns, status: status, statusT: 0 };
    });

    var floaters = [];
    var raf = 0, last = 0, countdown = 0, destroyed = false;

    function render(i) {
      var q = engine.state.players[i].question, u = ui[i];
      u.word.textContent = q.word;
      q.options.forEach(function (o, k) {
        u.opts[k].textContent = '';
        var kbd = el('kbd', null, KEYS[i].answers[k]);
        u.opts[k].appendChild(kbd);
        u.opts[k].appendChild(document.createTextNode(o));
      });
      var d = engine.DIFFICULTY[q.difficulty];
      u.stars.textContent = '★'.repeat(q.difficulty) + '☆'.repeat(3 - q.difficulty) +
        ' ' + d.label + ' (+' + d.boost + ' Tempo)';
    }

    function say(i, text) {
      ui[i].status.textContent = text; ui[i].statusT = 1.5;
    }

    function handleAnswer(i, k) {
      if (engine.state.status !== 'running') return;
      var res = engine.answer(i, k);
      if (!res) return;
      if (opts.onAnswer) opts.onAnswer(res);
      engine.drainEvents().forEach(function (e) {
        var p = engine.state.players[e.player];
        if (e.type === 'correct') say(e.player, e.difficulty === 3 ? '⚡ Boost! Schweres Wort!' : '🚗 Richtig!');
        if (e.type === 'wrong') say(e.player, '🐌 Falsch – du wirst langsamer');
        if (e.type === 'shield-block') say(e.player, '🛡️ Schild hat geschützt!');
        if (e.type === 'ability') { say(e.player, ABILITY_TEXT[e.ability]); floaters.push({ x: p.pos, t: 1.2, text: ABILITY_TEXT[e.ability], i: e.player }); }
      });
      render(i);
    }

    function draw() {
      var W = canvas.width, H = canvas.height, s = engine.state;
      ctx.clearRect(0, 0, W, H);
      var left = 40, right = W - 60, laneH = 70, top = 40;
      for (var i = 0; i < 2; i++) {
        var y = top + i * (laneH + 10);
        ctx.fillStyle = '#3d405b'; ctx.fillRect(left, y, right - left, laneH);
        ctx.strokeStyle = '#8d99ae'; ctx.setLineDash([14, 12]);
        ctx.beginPath(); ctx.moveTo(left, y + laneH / 2); ctx.lineTo(right, y + laneH / 2); ctx.stroke();
        ctx.setLineDash([]);
      }
      // Ziellinie (Schachbrett)
      for (var r = 0; r < 10; r++) {
        ctx.fillStyle = r % 2 ? '#fff' : '#000';
        ctx.fillRect(right, top + r * 15, 12, 15);
      }
      if (!s.players.length) return;
      s.players.forEach(function (p, i) {
        var y = top + i * (laneH + 10) + laneH / 2;
        var x = left + (right - left) * (p.pos / TRACK_LENGTH);
        ctx.font = '36px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1);
        ctx.fillText('🏎️', 0, 0); ctx.restore();
        ctx.font = '18px serif';
        if (p.boostT > 0) ctx.fillText('🔥', x - 34, y);
        if (p.slowT > 0) ctx.fillText('🐌', x, y - 30);
        if (p.shield) ctx.fillText('🛡️', x + 24, y - 26);
        ctx.fillStyle = COLORS[i]; ctx.font = 'bold 14px sans-serif';
        ctx.fillText(Math.round(p.speed * (p.boostT > 0 ? 1.6 : 1) * (p.slowT > 0 ? 0.4 : 1) * 4) + ' km/h', x, y + 32);
      });
      floaters.forEach(function (f) {
        var x = left + (right - left) * (f.x / TRACK_LENGTH);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
        ctx.globalAlpha = Math.min(1, f.t);
        ctx.fillText(f.text, x, top - 10 - (1.2 - f.t) * 20);
        ctx.globalAlpha = 1;
      });
    }

    function showOverlay(html, withButton) {
      overlay.textContent = ''; overlay.style.display = 'flex';
      overlay.appendChild(el('div', null, html));
      if (withButton) {
        var b = el('button', 'wr-btn', 'Nochmal spielen');
        b.addEventListener('click', begin);
        overlay.appendChild(b);
      }
    }

    function finish() {
      var s = engine.state;
      var text = s.winner === -1 ? '🤝 Unentschieden!' : '🏁 ' + NAMES[s.winner] + ' gewinnt!';
      var stats = s.players.map(function (p) { return { correct: p.correct, wrong: p.wrong }; });
      showOverlay(text + '\n', true);
      overlay.firstChild.style.whiteSpace = 'pre-line';
      overlay.firstChild.textContent = text + '\n' + stats.map(function (st, i) {
        return NAMES[i] + ': ' + st.correct + ' richtig, ' + st.wrong + ' falsch';
      }).join('\n');
      if (opts.onFinish) opts.onFinish({ winner: s.winner, stats: stats });
    }

    function loop(now) {
      if (destroyed) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (countdown > 0) {
        countdown -= dt;
        showOverlay(countdown > 0 ? String(Math.ceil(countdown)) : 'Los!', false);
        if (countdown <= 0) { overlay.style.display = 'none'; }
      } else {
        engine.tick(dt);
        if (engine.state.status === 'done' && overlay.style.display === 'none') finish();
      }
      ui.forEach(function (u) {
        if (u.statusT > 0 && (u.statusT -= dt) <= 0) u.status.textContent = '';
      });
      floaters = floaters.filter(function (f) { return (f.t -= dt) > 0; });
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onKey(e) {
      if (countdown > 0 || engine.state.status !== 'running') return;
      var key = e.key.toLowerCase();
      for (var i = 0; i < 2; i++) {
        var k = KEYS[i].answers.indexOf(key);
        if (k !== -1) { handleAnswer(i, k); return; }
      }
    }

    function begin() {
      engine.start();
      floaters = [];
      render(0); render(1);
      countdown = 3;
    }

    document.addEventListener('keydown', onKey);
    begin();
    last = performance.now();
    raf = requestAnimationFrame(loop);

    return {
      engine: engine,
      restart: begin,
      destroy: function () {
        destroyed = true;
        cancelAnimationFrame(raf);
        document.removeEventListener('keydown', onKey);
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      },
    };
  }

  return { create: create, createEngine: createEngine };
});
