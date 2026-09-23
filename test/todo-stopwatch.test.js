const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  finiteMin,
  normalizeTodoTiming,
  elapsedMs,
  start,
  pause,
  focusCredit,
  applyCredit
} = require('../src/main/todo-stopwatch');

test('manuel planlanan süre arbitrary pozitif dakika kabul eder', () => {
  assert.equal(finiteMin('65'), 65);
  assert.equal(finiteMin(120), 120);
  assert.equal(finiteMin(''), null);
  assert.equal(finiteMin(0), null);
  assert.equal(finiteMin(-5), null);
});

test('eski todo verisi timing alanları olmadan geriye uyumlu normalize edilir', () => {
  const t = normalizeTodoTiming({ id: 'x', text: 'eski iş' });
  assert.equal(t.plannedDurationMin, null);
  assert.equal(t.actualDurationMs, 0);
  assert.equal(t.stopwatchStartedAt, null);
  assert.equal(t.focusCreditedMin, 0);
});

test('kronometre pause/resume sırasında süreyi birikimli tutar', () => {
  let t = normalizeTodoTiming({ id: 'x', text: 'iş' });
  t = start(t, 1000);
  assert.equal(elapsedMs(t, 61000), 60000);
  t = pause(t, 61000);
  assert.equal(t.actualDurationMs, 60000);
  assert.equal(t.stopwatchStartedAt, null);

  t = start(t, 100000);
  t = pause(t, 130000);
  assert.equal(t.actualDurationMs, 90000);
});

test('focus credit pause sırasında tam dakikayı, finalde en yakın dakikayı işler ve duplicate olmaz', () => {
  let t = normalizeTodoTiming({ actualDurationMs: 90500, focusCreditedMin: 0 });
  assert.equal(focusCredit(t, { final: false }), 1);
  t = applyCredit(t, 1);
  assert.equal(focusCredit(t, { final: false }), 0);
  assert.equal(focusCredit(t, { final: true }), 1);
  t = applyCredit(t, 1);
  assert.equal(focusCredit(t, { final: true }), 0);
});

test('4.3.0 todo stopwatch UI ve IPC entegrasyonu vardır', () => {
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
  const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
  const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(__dirname, '../src/preload/preload.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
  const skins = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/skins.css'), 'utf8');
  const stats = fs.readFileSync(path.join(__dirname, '../src/main/stats.js'), 'utf8');

  assert.match(html, /id="todo-duration"[^>]*type="number"/);
  assert.match(panel, /todos:stopwatchStart/);
  assert.match(panel, /todos:stopwatchPause/);
  assert.match(panel, /Plan:/);
  assert.match(panel, /Gerçek:/);
  assert.match(main, /commitTodoStopwatch\(todo, null, \{ now, final: true \}\)/);
  assert.match(main, /pauseAllTodoStopwatches\(\{ final: false \}\)/);
  assert.match(main, /timer\?\.snapshot\(\)\.status === 'running'/);
  assert.match(preload, /todos:stopwatchStart/);
  assert.match(preload, /todos:stopwatchPause/);
  assert.match(stats, /addFocusMinutes\(minutes\)/);

  // Eski iç içe input görünümünü geri getirecek genel selector kullanılmamalı.
  assert.doesNotMatch(css, /\.todo-add input, \.soft-input/);
  assert.match(css, /\.todo-duration, \.todo-time/);

  for (const skin of ['latte','pazartesi','gece','disket','kasaba','yagmur','kar','cilek','mum','ege']) {
    assert.match(skins, new RegExp(`data-skin="${skin}"`));
  }
  assert.match(skins, /todo-stopwatch/);
});
