const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const ACHIEVEMENTS = require('../src/data/achievements');
const { Stats } = require('../src/main/stats');

class MemoryStore {
  constructor(seed = {}) { this.data = structuredClone(seed); }
  get() { return this.data; }
  set(next) { this.data = structuredClone(next); return this.data; }
}

const LEGACY_IDS = [
  'ilk_is','is_10','is_50','is_100','is_500','gunde_5','gunde_10','hepsi_bitti','gece_kusu','erken_kus',
  'ilk_sayac','sayac_25','odak_10s','odak_50s','gunluk_2s','maraton','pes_etmeyen','seri_3','seri_7','seri_30',
  'birlikte_30','birlikte_100','ilk_not','not_25','sev_1','sev_50','sev_200','uyandirdin','salladin','yakaladin','dogum_gunu'
];

test('Achievement v2 tam 125 benzersiz rozet içerir ve dağılım doğrudur', () => {
  assert.equal(ACHIEVEMENTS.length, 125);
  assert.equal(new Set(ACHIEVEMENTS.map((a) => a.id)).size, 125);
  const count = (r) => ACHIEVEMENTS.filter((a) => a.rarity === r).length;
  assert.equal(count('yaygin'), 25);
  assert.equal(count('siradisi'), 35);
  assert.equal(count('nadir'), 20);
  assert.equal(count('efsanevi'), 20);
  assert.equal(count('gizli'), 25);
});

test('4.0.x mevcut 31 achievement IDsi korunmuştur', () => {
  const ids = new Set(ACHIEVEMENTS.map((a) => a.id));
  for (const id of LEGACY_IDS) assert.ok(ids.has(id), `eksik legacy id: ${id}`);
});

test('bütün rozetlerde UI için tamamlanmış görev açıklaması vardır', () => {
  for (const a of ACHIEVEMENTS) {
    assert.ok(a.title && a.desc && a.completedDesc, `${a.id} metin alanı eksik`);
    assert.ok(!a.completedDesc.startsWith('Tamamladın:'), `${a.id} generic completedDesc kullanıyor`);
    assert.ok(['yaygin','siradisi','nadir','efsanevi','gizli'].includes(a.rarity));
    assert.equal(a.hidden, a.rarity === 'gizli');
  }
});

test('kilitli gizli rozetler UI listesinden tamamen gizlenir, açılınca görünür', () => {
  const stats = new Stats(new MemoryStore());
  assert.equal(stats.achievementList().length, 100);
  stats.award('secret_boop');
  const list = stats.achievementList();
  assert.equal(list.length, 101);
  const boop = list.find((a) => a.id === 'secret_boop');
  assert.ok(boop?.unlockedAt);
});

test('aynı achievement ikinci kez unlock callback üretmez', () => {
  const stats = new Stats(new MemoryStore());
  let calls = 0;
  stats.onUnlock = () => { calls += 1; };
  stats.award('salladin');
  stats.award('salladin');
  stats.evaluate();
  assert.equal(calls, 1);
});

test('uzun dönem sayaçları 90 günlük prune dışında kalır', () => {
  const stats = new Stats(new MemoryStore({ daysActive: 179 }));
  stats.data.daysActive = 180;
  stats.evaluate();
  assert.ok(stats.data.achievements.aktif_180);
});

test('UI sekme sırası Sayaç -> Rozetler şeklindedir', () => {
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
  assert.ok(html.indexOf('data-tab="timer"') < html.indexOf('data-tab="badges"'));
});

test('tamamlanmış rozet tooltipi hover ve focus ile erişilebilir', () => {
  const js = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
  assert.match(js, /badge-tooltip/);
  assert.match(js, /completedDesc/);
  assert.match(js, /tabIndex\s*=\s*0/);
  assert.match(css, /\.badge\.on:hover \.badge-tooltip/);
  assert.match(css, /\.badge\.on:focus \.badge-tooltip/);
});


test('rozetler nadirlik sekmelerine ayrılır ve tek kategori render edilir', () => {
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
  for (const rarity of ['yaygin', 'siradisi', 'nadir', 'efsanevi', 'gizli']) {
    assert.match(html, new RegExp(`data-rarity="${rarity}"`));
  }
  assert.match(js, /activeBadgeRarity/);
  assert.match(js, /a\.rarity === activeBadgeRarity/);
  assert.match(js, /discoveredHidden/);
  assert.doesNotMatch(js, /BADGE_PAGE/);
  assert.doesNotMatch(html, /badges-more/);
  assert.match(css, /\.badge-rarity-tabs/);
  assert.match(css, /aria-selected="true"/);
});
