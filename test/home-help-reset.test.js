const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Stats } = require('../src/main/stats');

class MemoryStore {
  constructor(seed = {}) { this.data = structuredClone(seed); }
  get() { return structuredClone(this.data); }
  set(next) { this.data = structuredClone(next); return this.get(); }
}

test('Şimdiye kadar reset lifetime veriyi silmeden yalnız görünür baseline oluşturur', () => {
  const store = new MemoryStore({
    firstUsedAt: Date.now() - 10 * 86400000,
    totals: { todos: 12, todoCreated: 20, focusMin: 480, timersDone: 8, timersQuit: 2, notes: 7, pets: 15 },
    achievements: { legacy_test: 123456 },
    bestStreak: 6
  });
  const stats = new Stats(store);

  const lifetimeBefore = structuredClone(stats.summary().totals);
  const unlockedBefore = [...stats.summary().unlockedIds];

  stats.resetDisplayBaseline(Date.now());
  const after = stats.summary();

  assert.deepEqual(after.totals, lifetimeBefore);
  assert.deepEqual(after.unlockedIds, unlockedBefore);
  assert.equal(after.display.baselineAt > 0, true);
  assert.equal(after.display.totals.todos, 0);
  assert.equal(after.display.totals.focusMin, 0);
  assert.equal(after.display.totals.timersDone, 0);
  assert.equal(after.display.totals.timersQuit, 0);
  assert.equal(after.display.totals.notes, 0);
  assert.equal(after.display.totals.pets, 0);
  assert.equal(after.display.bestStreak, 0);
});

test('reset sonrası görünür sayaçlar lifetime sayaçlardan bağımsız artar', () => {
  const store = new MemoryStore({
    totals: { todos: 5, todoCreated: 9, focusMin: 120, timersDone: 3, timersQuit: 1, notes: 4, pets: 6 }
  });
  const stats = new Stats(store);
  stats.resetDisplayBaseline(Date.now());

  stats.todoDone(1);
  stats.addFocusMinutes(35);
  stats.noteCreated();
  stats.pet();

  const sum = stats.summary();
  assert.equal(sum.display.totals.todos, 1);
  assert.equal(sum.display.totals.focusMin, 35);
  assert.equal(sum.display.totals.notes, 1);
  assert.equal(sum.display.totals.pets, 1);
  assert.equal(sum.totals.todos, 6);
  assert.equal(sum.totals.focusMin, 155);
});

test('reset sonrası en uzun seri ayrı izlenir ve lifetime bestStreak bozulmaz', () => {
  const base = new Date(2026, 8, 23, 12, 0, 0);
  const store = new MemoryStore({ bestStreak: 20, streak: 20, lastActiveDay: '2026-09-23' });
  const stats = new Stats(store);
  stats.resetDisplayBaseline(base.getTime());

  stats.markActive(new Date(2026, 8, 24, 12, 0, 0));
  stats.markActive(new Date(2026, 8, 25, 12, 0, 0));

  const sum = stats.summary();
  assert.equal(sum.bestStreak >= 20, true);
  assert.equal(sum.display.bestStreak, 2);
});

test('ana sayfa yardım ikonları, reset modalı ve IPC entegrasyonu vardır', () => {
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
  const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
  const skins = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/skins.css'), 'utf8');
  const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(__dirname, '../src/preload/preload.js'), 'utf8');

  assert.equal((html.match(/class="section-help"/g) || []).length, 7);
  for (const title of ['Bu hafta odak','Şimdiye kadar','Masa köşen','Haftalık mektup','Moodboard','Kavanoz','Bu ay yaptıkların']) {
    assert.match(html, new RegExp(title));
  }
  assert.match(html, /id="stats-reset"/);
  assert.match(html, /id="stats-reset-modal"/);
  assert.match(html, /Yeni bir sayfa mı açıyoruz\?/);
  assert.match(html, /Sıfırdan say/);
  assert.match(html, /Vazgeç/);
  assert.match(panel, /stats:resetDisplay/);
  assert.match(panel, /st\.display/);
  assert.match(panel, /closeSectionHelp/);
  assert.match(main, /ipcMain\.handle\('stats:resetDisplay'/);
  assert.match(preload, /'stats:resetDisplay'/);
  assert.match(css, /\.section-help\s*\{[\s\S]*?width:\s*18px;[\s\S]*?height:\s*18px;[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;/);
  assert.match(css, /\.section-tooltip\s*\{[\s\S]*?max-width:\s*min\(220px, 66vw\);[\s\S]*?padding:\s*6px 8px;/);
  assert.match(css, /\.confirm-backdrop/);
  assert.match(css, /\.nero-says\s*\{[\s\S]*?align-items:\s*center/);

  assert.match(skins, /background:\s*var\(--surface\) no-repeat 12px center \/ 22px 22px/);
  assert.match(skins, /background:\s*var\(--glass\) no-repeat 12px center \/ 26px 26px/);
  for (const skin of ['latte','pazartesi','gece','disket','kasaba','yagmur','kar','cilek','mum','ege']) {
    assert.match(skins, new RegExp('data-skin="' + skin + '"'));
  }
  assert.match(skins, /4\.3\.1 — küçük, border'sız yardım işaretleri/);
  assert.match(skins, /\[data-skin\] \.section-help\s*\{[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;/);
  assert.match(skins, /confirm-card/);
});
