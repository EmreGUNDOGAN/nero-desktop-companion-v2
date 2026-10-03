const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { BeeGame } = require('../src/main/bee');

class MemoryStore {
  constructor(value = null) { this.value = value; }
  get() { return this.value; }
  set(value) { this.value = JSON.parse(JSON.stringify(value)); }
  flush() {}
}

function freshGame() {
  return new BeeGame(new MemoryStore());
}

test('6.5.0 Seyyah Yakup aradığı balı pazarın yüzde 15 üstünden alır', () => {
  const bee = freshGame();
  bee.state.market.mult.yonca = 1;
  bee.state.merchant = {
    active: true, slot: 'm:cart', until: bee.dayIndex() + 2,
    wants: 'yonca', wantsLeft: 10, salesTicketKg: 0,
    stock: [], bought: [], sandik: 0
  };
  const marketPrice = bee.price('yonca');
  const merchant = bee.merchantView();
  assert.equal(merchant.honeyBonusPct, 15);
  assert.equal(merchant.wantsPrice, Math.round(marketPrice * 1.15 * 10) / 10);
});

test('6.5.0 Atölye karesi baştan rezerve ve yerleştirmeye kapalıdır', () => {
  const bee = freshGame();
  const view = bee.view();
  assert.equal(view.workshopTile, '-1,2');
  const tile = bee.state.tiles[view.workshopTile];
  assert.ok(tile);
  assert.equal(tile.kind, 'workshop');
  assert.equal(tile.owned, false);
  assert.equal(bee.isBuyable(view.workshopTile), false);

  bee.state.coins = 99999;
  bee.state.vouchers.yonca = 1;
  bee.state.decorInventory.bank = 1;
  assert.equal(bee.placeHive(view.workshopTile).ok, false);
  assert.equal(bee.plantSeed(view.workshopTile, 'yonca').ok, false);
  assert.equal(bee.placeDecor(view.workshopTile, 'bank').ok, false);
});

test('6.5.0 eski kayıtta Atölye karesindeki oyuncu içeriği kaybolmadan taşınır', () => {
  const first = freshGame();
  const old = first.state;
  old.tiles['-1,2'].kind = 'grass';
  old.tiles['-1,2'].owned = true;
  old.tiles['-1,2'].tree = false;
  old.tiles['-1,2'].item = { type: 'flower', flower: 'kestane' };
  const restored = new BeeGame(new MemoryStore(old));

  assert.equal(restored.state.tiles['-1,2'].kind, 'workshop');
  assert.equal(restored.state.tiles['-1,2'].item, null);
  assert.ok(Object.entries(restored.state.tiles).some(([k, t]) => k !== '-1,2' && t.item?.type === 'flower' && t.item.flower === 'kestane'));
  assert.ok(Object.values(restored.state.tiles).some((t) => t.kind === 'storage'));
});

test('6.5.0 satın alınan dekor Depoya gider ve kaldırılınca tekrar Depoya döner', () => {
  const bee = freshGame();
  bee.state.coins = 99999;
  assert.equal(bee.buyDecor('bank').ok, true);
  assert.equal(bee.state.decorInventory.bank, 1);

  const key = '-1,0';
  assert.equal(bee.state.tiles[key].owned, true);
  assert.equal(bee.placeDecor(key, 'bank').ok, true);
  assert.equal(bee.state.decorInventory.bank || 0, 0);
  assert.equal(bee.state.tiles[key].decor, 'bank');

  assert.equal(bee.removeDecor(key).ok, true);
  assert.equal(bee.state.tiles[key].decor, null);
  assert.equal(bee.state.decorInventory.bank, 1);
});

test('6.5.0 satın alınan ve hediye edilen tohumlar aynı Depo stokundan ekilir', () => {
  const bee = freshGame();
  bee.state.coins = 99999;
  assert.equal(bee.buySeed('yonca').ok, true);
  bee.state.vouchers.yonca += 1; // hediye edilen ikinci tohum
  assert.equal(bee.state.vouchers.yonca, 2);

  const key = '0,-1';
  assert.equal(bee.plantSeed(key, 'yonca').ok, true);
  assert.equal(bee.state.vouchers.yonca, 1);
  assert.equal(bee.state.tiles[key].item.flower, 'yonca');
});

test('6.5.0 renderer merkezi Depoyu ve fiziksel Atölyeyi içerir', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.css'), 'utf8');
  const workshopAsset = fs.readFileSync(path.join(root, 'src/renderer/bee/gorsel/atolye.js'), 'utf8');

  for (const tab of ['honey','apiary','seeds','decor','products']) {
    assert.match(html, new RegExp('data-warehouse-tab="' + tab + '"'));
  }
  assert.match(html, /id="warehouse-modal"/);
  assert.match(js, /function openWarehouse/);
  assert.match(js, /makeWorkshopBuilding/);
  assert.match(js, /t\.kind === 'workshop'/);
  assert.match(js, /M\.honeyBonusPct \|\| 15/);
  assert.match(css, /\.warehouse-card/);
  assert.match(workshopAsset, /makeWorkshopBuilding/);
});

test('6.5.0 Atölye tamamlanmış ürünleri kullanıcıya Depo üzerinden gösterir', () => {
  const root = path.join(__dirname, '..');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  assert.match(js, /Tamamlanan ürünler Depo’ya gider/);
  assert.match(js, /data-workshop-depot/);
  assert.match(js, /data-warehouse-use/);
  assert.match(js, /data-warehouse-sell/);
});


test('6.5.0 denge düzeltmesi: balmumu 25 g/kg ve canlandırma yüzde 25', () => {
  const bee = freshGame();
  assert.equal(bee.reviveCost('kestane'), Math.round(bee.seedCost('kestane') * 0.25));
  const h = Object.values(bee.state.hives)[0];
  h.honey = { yonca: 10 };
  bee.state.storageCap = 999;
  const beforeWax = bee.state.wax;
  const res = bee.harvestHive(h.id);
  assert.equal(res.ok, true);
  assert.ok(Math.abs((bee.state.wax - beforeWax) - 0.25) < 1e-6);
});

test('6.5.0 denge düzeltmesi: sipariş 4x hızda daha hızlı sonlanmaz', () => {
  const bee = freshGame();
  const ord = bee.makeOrder();
  bee.state.orders.list = [ord];
  bee.acceptOrder(ord.id);
  const left = ord.deadlineClock - bee.state.orderClockMs;
  bee.state.speed = 4;
  bee.lastTickAt = 1000;
  bee.tick(61000);
  const after = ord.deadlineClock - bee.state.orderClockMs;
  assert.equal(Math.round(left - after), 60000);
});

test('6.5.0 denge düzeltmesi: köy 35 bin kg çizgisinde tamamlanır', () => {
  const bee = freshGame();
  assert.equal(bee.villageTarget(149), 6);
  assert.equal(bee.villageTarget(150), 8);
  assert.equal(bee.villageTarget(400), 9);
  assert.equal(bee.villageTarget(1000), 10);
  assert.equal(bee.villageTarget(35000), 78);
});

test('6.5.0 denge düzeltmesi: kış Ezgi seçimi Kış Fundasını seçebilir', () => {
  const bee = freshGame();
  bee.state.village.arrived = Array.from({ length: 7 }, (_, i) => i + 1);
  bee.state.gameMs = 45 * bee.view().dayMs;
  assert.equal(bee.calendar().season, 'kis');
  assert.equal(bee.ezgiChoice(), 'kisfundasi');
});

test('6.5.0 denge düzeltmesi: Atölye kuyruk iptalinde malzemeler tam iade edilir', () => {
  const bee = freshGame();
  bee.state.village.arrived = Array.from({ length: 30 }, (_, i) => i + 1);
  bee.state.workshop.active = [{ id: 'busy', recipe: 'candle', totalMs: 1000, remainingMs: 1000 }];
  bee.state.wax = 2;
  const before = bee.state.wax;
  assert.equal(bee.enqueueWorkshop('candle').ok, true);
  const queued = bee.state.workshop.queue[0];
  assert.ok(queued && queued.refund);
  assert.equal(bee.cancelWorkshopJob(queued.id).ok, true);
  assert.ok(Math.abs(bee.state.wax - before) < 1e-9);
});

test('6.5.0 denge düzeltmesi: turnuva ödülü backend ile sonuç ekranında aynıdır', () => {
  const root = path.join(__dirname, '..');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const core = fs.readFileSync(path.join(root, 'src/main/bee.js'), 'utf8');
  assert.match(core, /coins: 300, cup: 'altın'/);
  assert.match(js, /coins: 300/);
});