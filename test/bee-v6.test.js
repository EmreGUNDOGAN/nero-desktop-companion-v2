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

test('rivals produce for one game day, and inflated old saves are repaired once', () => {
  const bee = start();
  const rival = bee.state.rivals[0];
  const before = rival.farm.honey;
  bee.state.market.mult.yonca = 0.5; // temkinli rakip bu fiyatta satış yapmaz
  bee.rollRivals(1);
  assert.ok(rival.farm.honey - before < 2, 'one day should not contain eight hours of production');
  const old = structuredClone(bee.state);
  old.rivalDayRateFixed = false;
  old.rivals[0].nw = 180000;
  old.rivals[0].farm.coins = 170000;
  old.rivals[0].history = [150000, 180000];
  const loaded = new BeeGame(new MemoryStore(old));
  assert.ok(loaded.state.rivals[0].nw < loaded.netWorth() * 2);
  assert.equal(loaded.state.rivalDayRateFixed, true);
  const reloaded = new BeeGame(new MemoryStore(structuredClone(loaded.state)));
  assert.equal(reloaded.state.rivals[0].nw, loaded.state.rivals[0].nw);
});

test('orders request planted flowers regardless of storage', () => {
  const bee = start();
  bee.state.storage.kestane = 12;
  for (const tile of Object.values(bee.state.tiles)) if (tile.item?.type === 'flower') tile.item = null;
  assert.equal(bee.makeOrder(), null);
  bee.state.tiles['1,-1'].item = { type: 'flower', flower: 'kekik', plantedDay: 0 };
  bee.state.storage.kekik = 0;
  assert.equal(bee.makeOrder().flower, 'kekik');
});

test('winter suppresses out-of-season flowers and wax provides modest extra income', () => {
  const bee = start();
  const id = Object.keys(bee.state.hives)[0];
  bee.state.gameMs = 45 * 15 * 60 * 1000;
  const winter = bee.hiveRates(id).yonca;
  bee.state.gameMs = 60 * 15 * 60 * 1000;
  assert.ok(winter < bee.hiveRates(id).yonca);
  bee.state.market.mult.yonca = 1;
  assert.equal(bee.candlePrice(), 45);
});

test('three new farmable rings migrate saves and relocate village homes', () => {
  const fresh = start();
  assert.equal(Object.values(fresh.state.tiles).length, 217);
  assert.equal(fresh.state.tiles['-8,0'].kind, 'grass');
  assert.equal(fresh.state.tiles['-5,1'].kind, 'festival');
  const old = structuredClone(fresh.state);
  for (const [key, tile] of Object.entries(old.tiles))
    if (Math.max(Math.abs(tile.q), Math.abs(tile.r), Math.abs(tile.q + tile.r)) > 5) delete old.tiles[key];
  old.islandExpanded61 = false;
  old.village.slots[1] = '-6,6';
  const migrated = new BeeGame(new MemoryStore(old));
  assert.equal(Object.values(migrated.state.tiles).length, 217);
  assert.equal(migrated.state.village.slots[1], migrated.villageSlot(1));
  assert.equal(migrated.state.tiles['1,0'].item.type, 'hive');
});

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
