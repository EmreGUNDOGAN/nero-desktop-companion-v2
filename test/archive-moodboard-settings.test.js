const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  monthKey,
  daysInMonthKey,
  userMonth,
  setUserMood,
  dataMonths,
  closedDataMonths,
  renderMoodboardSvg
} = require('../src/main/moodboard');
const { Journal } = require('../src/main/journal');

class MemoryStore {
  constructor(seed) { this.data = structuredClone(seed); }
  get() { return this.data; }
  set(next) { this.data = structuredClone(next); return this.data; }
}

test('moodboard takvim ayının gerçek gün sayısını kullanır', () => {
  assert.equal(daysInMonthKey('2026-02'), 28);
  assert.equal(daysInMonthKey('2028-02'), 29);
  assert.equal(daysInMonthKey('2026-09'), 30);
  assert.equal(daysInMonthKey('2026-10'), 31);
  assert.equal(monthKey(new Date(2026, 8, 23)), '2026-09');
});

test('kullanıcı moodboardu geçmiş/bugün seçilebilir, gelecek günleri işaretler', () => {
  const now = new Date(2026, 8, 23, 12, 0, 0);
  let data = { days: {}, exports: {} };
  data = setUserMood(data, '2026-09-23', 'green');
  data = setUserMood(data, '2026-09-22', 'red');
  const month = userMonth(data, '2026-09', now);
  assert.equal(month.length, 30);
  assert.equal(month[21].value, 'red');
  assert.equal(month[22].value, 'green');
  assert.equal(month[22].future, false);
  assert.equal(month[23].future, true);
  assert.equal(setUserMood(data, '2026-09-23', 'blue'), null);
});

test('kapanmış veri ayları user ve Nero günlüğünden birlikte bulunur', () => {
  const result = closedDataMonths(
    { days: { '2026-07-01': 'green', '2026-09-02': 'yellow' } },
    { days: { '2026-08-03': { sum: 70, count: 1 }, '2026-09-01': { sum: 80, count: 1 } } },
    '2026-09'
  );
  assert.deepEqual(result, ['2026-07', '2026-08']);
});

test('geçmiş moodboard menüsü yalnız gerçekten veri bulunan ayları döndürür', () => {
  const result = dataMonths(
    { days: {
      '2026-03-01': 'green',
      '2026-04-02': null,
      '2026-09-20': 'yellow',
      '2030-01-01': 'red'
    } },
    { days: {
      '2026-02-11': { sum: 0, count: 0 },
      '2026-08-03': { sum: 70, count: 1 },
      '2025-12-04': { sum: 80, count: 2 }
    } },
    '2026-09'
  );
  assert.deepEqual(result, ['2025-12', '2026-03', '2026-08', '2026-09']);
});

test('Nero mood günlüğü bir takvim ayını 5 bucket sistemiyle döndürür', () => {
  const moodStore = new MemoryStore({ days: {
    '2026-09-01': { sum: 20, count: 1 },
    '2026-09-02': { sum: 180, count: 2 },
    '2026-09-03': { sum: 130, count: 2 }
  } });
  const journal = new Journal({
    moodStore,
    archiveStore: new MemoryStore({ items: [] }),
    jarStore: new MemoryStore({ items: [] })
  });
  const days = journal.month('2026-09');
  assert.equal(days.length, 30);
  assert.equal(days[0].cls, 'c1');
  assert.equal(days[1].cls, 'c5');
  assert.equal(days[2].cls, 'c4');
  assert.equal(days[3].cls, null);
});

test('aylık PNG kaynağı iki moodboardu aynı görselde üretmek için SVG içerir', () => {
  const user = userMonth({ days: { '2026-09-01': 'green' } }, '2026-09', new Date(2026, 9, 1));
  const nero = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, date: `2026-09-${String(i + 1).padStart(2, '0')}`, cls: i === 0 ? 'c5' : null }));
  const svg = renderMoodboardSvg({ key: '2026-09', userDays: user, neroDays: nero });
  assert.match(svg, /Benim Moodboard’um/);
  assert.match(svg, /Nero’nun Moodboard’u/);
  assert.match(svg, /Eylül 2026 Moodboard/);
  assert.match(svg, /<svg/);
});

test('İşler ve Notlar sayfalarında manuel aylık arşiv UI/IPC altyapısı vardır', () => {
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
  const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
  const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(__dirname, '../src/preload/preload.js'), 'utf8');

  assert.match(html, /id="notes-archive"/);
  assert.match(html, /id="todos-archive"/);
  assert.match(html, /id="note-archive"/);
  assert.match(html, /Bitenleri arşivle/);
  assert.match(panel, /renderMonthlyArchive/);
  assert.match(panel, /api\.invoke\('notes:archive'/);
  assert.match(panel, /api\.invoke\('todos:archive'/);
  assert.match(panel, /api\.invoke\('todos:archiveDone'/);
  assert.match(main, /ipcMain\.handle\('notes:archive'/);
  assert.match(main, /ipcMain\.handle\('todos:archive'/);
  assert.match(main, /ipcMain\.handle\('todos:archiveDone'/);
  assert.match(preload, /'notes:archive'/);
  assert.match(preload, /'todos:archiveDone'/);
});

test('eski Bitenleri temizle IPCsi artık veriyi silmek yerine arşivler', () => {
  const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const start = main.indexOf("ipcMain.handle('todos:clearDone'");
  const chunk = main.slice(start, start + 500);
  assert.match(chunk, /archivedAt/);
  assert.doesNotMatch(chunk, /filter\(\(t\) => !t\.done\)/);
});

test('Home Bu ay yaptıkların ilk 5 işten sonra dropdown kullanır ve tüm ay verisini ister', () => {
  const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
  const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
  assert.match(panel, /items\.slice\(0, 5\)/);
  assert.match(panel, /items\.slice\(5\)/);
  assert.match(html, /id="archive-more"/);
  assert.match(main, /journal\.thisMonth\(\)/);
  assert.doesNotMatch(main, /journal\.thisMonth\(8\)/);
});

test('Ayarlar navbar yerine üst sağ tema uyumlu dişli düğmesindedir', () => {
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
  const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
  const skins = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/skins.css'), 'utf8');
  assert.match(html, /id="settings-button"/);
  assert.doesNotMatch(html, /data-tab="settings"/);
  assert.equal((html.match(/<button role="tab" data-tab=/g) || []).length, 5);
  assert.ok(html.indexOf('id="settings-button"') < html.indexOf('id="pin"'));
  assert.match(panel, /settings-button'\)\.addEventListener\('click', \(\) => selectTab\('settings'\)/);
  assert.match(css, /\.close\.settings-btn/);
  for (const skin of ['latte', 'pazartesi', 'gece', 'disket', 'kasaba', 'yagmur', 'kar', 'cilek', 'mum', 'ege']) {
    assert.match(skins, new RegExp(`data-skin="${skin}"`));
  }
  assert.match(skins, /settings-btn/);
});

test('iki moodboard rendererda ayrıdır, kompaktır ve yalnız dolu geçmiş aylara gider', () => {
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
  const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
  const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(__dirname, '../src/preload/preload.js'), 'utf8');
  assert.match(html, /Benim Moodboard’um/);
  assert.match(html, /Nero’nun Moodboard’u/);
  assert.match(html, /id="user-mood-calendar"/);
  assert.match(html, /id="nero-mood-calendar"/);
  assert.match(html, /id="mood-history-toggle"/);
  assert.match(html, /id="mood-history-popover"/);
  assert.match(html, /id="moodboard-prev"/);
  assert.match(html, /id="moodboard-next"/);
  assert.match(html, /id="moodboard-current"/);
  assert.doesNotMatch(html, /id="mood-strip"/);
  assert.match(panel, /moodboard:set/);
  assert.match(panel, /moodboard:get/);
  assert.match(panel, /geçmiş kayıt · salt okunur/);
  assert.match(panel, /gridColumnStart/);
  assert.match(main, /ipcMain\.handle\('moodboard:get'/);
  assert.match(main, /dataMonths\(/);
  assert.match(preload, /'moodboard:get'/);
  assert.match(css, /grid-template-columns:\s*repeat\(7, 36px\)/);
  assert.match(css, /row-gap:\s*10px/);
  assert.match(css, /\.mood-history-popover/);
});

test('moodboard ve yeni arşiv verileri backup snapshotına dahil edilir', () => {
  const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const start = main.indexOf('function snapshotData()');
  const chunk = main.slice(start, start + 900);
  assert.match(chunk, /userMoodboard/);
  assert.match(chunk, /moodLog/);
  assert.match(chunk, /archive:/);
  assert.match(chunk, /jar:/);
});
