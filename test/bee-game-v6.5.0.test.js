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
