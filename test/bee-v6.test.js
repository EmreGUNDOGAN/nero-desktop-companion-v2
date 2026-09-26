const test = require('node:test');
const assert = require('node:assert/strict');
const { BeeGame, FLOWERS } = require('../src/main/bee');

class MemoryStore {
  constructor(value = null) { this.value = value; }
  get() { return this.value; }
  set(value) { this.value = value; }
  flush() {}
}
const start = () => new BeeGame(new MemoryStore());

test('winter heather migrates all saved honey and old references without losing quantity', () => {
  const old = start();
  old.state.storage.ihlamur = 2.3;
  old.state.hives[Object.keys(old.state.hives)[0]].honey.ihlamur = 1.1;
  old.state.tiles['1,-1'].item.flower = 'ihlamur';
  old.state.orders.list.push({ id: 'old', flower: 'ihlamur', status: 'open' });
  delete old.state.winterHeatherMigrated;
  const loaded = new BeeGame(new MemoryStore(structuredClone(old.state)));
  assert.equal(loaded.state.storage.kisfundasi, 2.3);
  assert.equal(loaded.state.hives[Object.keys(loaded.state.hives)[0]].honey.kisfundasi, 1.1);
  assert.equal(loaded.state.tiles['1,-1'].item.flower, 'kisfundasi');
  assert.equal(loaded.state.orders.list[0].flower, 'kisfundasi');
  assert.equal(FLOWERS.kisfundasi.seed, 975);
  assert.equal(FLOWERS.kisfundasi.price, 55);
});

test('new hives cost 900 then 1125, and undo restores coins and price', () => {
  const bee = start();
  bee.state.coins = 5000;
  const open = Object.entries(bee.state.tiles).filter(([, t]) => t.owned && !t.item).map(([k]) => k);
  assert.equal(bee.nextHiveCost(), 900);
  assert.equal(bee.placeHive(open[0]).ok, true);
  assert.equal(bee.nextHiveCost(), 1125);
  assert.equal(bee.undoPlacement().ok, true);
  assert.equal(bee.state.coins, 5000);
  assert.equal(bee.nextHiveCost(), 900);
  assert.equal(bee.placeHive(open[0]).ok, true);
  bee.commitPlacement();
  assert.equal(bee.placeHive(open[1]).ok, true);
  assert.equal(bee.state.hives[bee.state.tiles[open[1]].item.id].invested, 1125);
});

test('plant undo restores an inventory seed and prevents its immediate production bonus', () => {
  const bee = start();
  const open = Object.entries(bee.state.tiles).find(([, t]) => t.owned && !t.item)[0];
  bee.state.vouchers.yonca = 1;
  const hiveId = Object.keys(bee.state.hives)[0];
  const before = bee.hiveRates(hiveId);
  assert.equal(bee.plantSeed(open, 'yonca').ok, true);
  assert.deepEqual(bee.hiveRates(hiveId), before);
  assert.equal(bee.undoPlacement().ok, true);
  assert.equal(bee.state.vouchers.yonca, 1);
});

test('ten-second undo expires and the placement becomes productive only after commit', () => {
  const bee = start();
  const open = Object.entries(bee.state.tiles).find(([, t]) => t.owned && !t.item)[0];
  bee.state.coins = 1500;
  bee.plantSeed(open, 'yonca');
  const id = Object.keys(bee.state.hives)[0];
  assert.equal(bee.state.tiles[open].item.undoPending, true);
  bee.state.undoPlacement.expiresAt = Date.now() - 1;
  assert.equal(bee.undoPlacement().ok, false);
  bee.tick(Date.now() + 1000);
  assert.equal(bee.state.undoPlacement, null);
  assert.equal(bee.state.tiles[open].item.undoPending, undefined);
  assert.ok(bee.hiveRates(id).yonca > 0);
});

test('seasonal tournament records each category and pays a top-three prize once', () => {
  const bee = start();
  bee.state.gameMs = 13 * 15 * 60 * 1000;
  bee.state.storage.yonca = 10;
  assert.equal(bee.enterFestival('yonca', 5).ok, true);
  bee.judgeFestival(15);
  const result = bee.state.festival.results[0];
  assert.equal(result.year, 1);
  assert.equal(result.season, 'ilkbahar');
  assert.equal(result.all.length, 4);
  for (const x of result.all) assert.equal(x.score, Object.values(x.categories).reduce((a, b) => a + b, 0));
  assert.equal(bee.state.festival.entry, null);
  const coins = bee.state.coins;
  bee.judgeFestival(15);
  assert.equal(bee.state.coins, coins);
});

test('rivals receive independent seasonal cups even when the player does not enter', () => {
  const bee = start();
  bee.judgeFestival(15);
  const result = bee.state.festival.results[0];
  assert.equal(result.place, null);
  assert.equal(result.all.length, 3);
  assert.deepEqual(bee.state.rivals.map((r) => Object.values(r.cups || {}).reduce((a, b) => a + b, 0)).sort(), [1, 1, 1]);
  assert.equal(bee.state.festival.cups.length, 0);
});

test('gold cup grants exactly one next-year matching-season production boost', () => {
  const bee = start();
  const id = Object.keys(bee.state.hives)[0];
  const dayMs = 15 * 60 * 1000;
  bee.state.gameMs = 60 * dayMs;
  const plain = bee.hiveRates(id).yonca;
  bee.state.festival.cups.push({ cup: 'altın', season: 'ilkbahar', year: 1 });
  const boosted = bee.hiveRates(id).yonca;
  assert.ok(Math.abs(boosted / plain - 1.2) < 1e-9);
  bee.state.festival.cups.push({ cup: 'altın', season: 'ilkbahar', year: 1 });
  assert.equal(bee.hiveRates(id).yonca, boosted);
  bee.state.gameMs = 75 * dayMs;
  const summer = bee.hiveRates(id).yonca;
  bee.state.festival.cups = [];
  assert.equal(bee.hiveRates(id).yonca, summer);
});

test('walkers route around water and never pick a disconnected destination', async () => {
  const { createWalkers } = await import('../src/renderer/bee/walkers.js');
  const walkers = createWalkers({ world: () => {}, height: () => 0 });
  walkers.setMap({ '0,0': { kind: 'grass' }, '1,0': { kind: 'water' }, '0,1': { kind: 'grass' }, '1,1': { kind: 'grass' }, '2,0': { kind: 'grass' } });
  const path = walkers.findPath('0,0', '2,0');
  assert.equal(path[0], '0,0');
  assert.equal(path.at(-1), '2,0');
  assert.ok(!path.includes('1,0'));
  assert.deepEqual(walkers.findPath('0,0', '5,5'), []);
});


test('6.0.0 turnuva popupı şeffaf kategori kartlarını ve doğru ödülleri gösterir', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, '../src/renderer/bee/bee.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../src/renderer/bee/bee.css'), 'utf8');
  assert.match(html, /cup-result-title/);
  assert.match(js, /Bal Kalitesi/);
  assert.match(js, /Arıcılık Ustalığı/);
  assert.match(js, /Üretim Başarısı/);
  assert.match(js, /Köy İtibarı/);
  assert.match(js, /750/);
  assert.match(js, /500/);
  assert.match(js, /250/);
  assert.match(js, /\+%20 üretim/);
  assert.match(css, /\.cup-category-grid/);
  assert.match(css, /\.cup-reward-box/);
});

test('6.0.0 Festival Cilası yalnız Bal Kalitesine +20 olarak anlatılır', () => {
  const bee = start();
  const desc = require('../src/main/bee').MERCHANT_ITEMS?.festivalCila?.desc;
  if (desc != null) assert.match(desc, /Bal Kalitesi puanına \+20/);
  const src = require('node:fs').readFileSync(require('node:path').join(__dirname, '../src/main/bee.js'), 'utf8');
  assert.doesNotMatch(src, /Festival Cilası \+%5 aktif/);
  assert.match(src, /Bal Kalitesi \+20/);
});
