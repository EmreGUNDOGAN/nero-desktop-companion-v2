const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { BeeGame, FLOWERS } = require('../src/main/bee');

class MemoryStore {
  constructor(value = {}) { this.value = value; }
  get() { return this.value; }
  set(value) { this.value = value; }
  flush() {}
}

const DAY_MS = 15 * 60 * 1000;

function freshGame() {
  return new BeeGame(new MemoryStore({}));
}

function unlock(bee, n) {
  if (!bee.state.village.arrived.includes(n)) bee.state.village.arrived.push(n);
}

test('6.4.0 kış normal bal mevsim fiyatı +%15 olur', () => {
  const bee = freshGame();
  bee.state.village.arrived = [];
  bee.state.gameMs = 45 * DAY_MS; // kış 1. gün
  bee.state.market.event = null;
  bee.state.marketLocks = {};
  bee.state.market.mult.yonca = 1;
  assert.equal(FLOWERS.yonca.price, 8);
  assert.equal(bee.price('yonca'), 9.2);
  assert.equal(bee.view().seasonPrice, 1.15);
});

test('6.4.0 yan ürün potansiyeli gerçek kovan koşullarından hesaplanır', () => {
  const bee = freshGame();
  const hive = Object.values(bee.state.hives)[0];

  const early = bee.byproductProfile(hive.id);
  assert.ok(early.pollen.rate > 0, 'aktif çiçekleri olan başlangıç kovanında polen oluşmalı');
  assert.equal(early.propolis.rate, 0);
  assert.equal(early.royalJelly.rate, 0);

  hive.bees = 12;
  hive.queens = 1;
  hive.sick = false;
  const mature = bee.byproductProfile(hive.id);
  assert.ok(mature.propolis.rate > 0);
  assert.ok(mature.royalJelly.rate > 0);

  bee.accrueByproducts(hive, 10);
  assert.ok(hive.byproducts.pollen > 0);
  assert.ok(hive.byproducts.propolis > 0);
  assert.ok(hive.byproducts.royalJelly > 0);
});

test('6.4.0 yan ürünler bal hasadıyla orantılı olarak atölye deposuna taşınır', () => {
  const bee = freshGame();
  const hive = Object.values(bee.state.hives)[0];
  hive.honey = { yonca: 10 };
  hive.byproducts = { pollen: 80, propolis: 25, royalJelly: 4 };
  bee.state.storage = {};
  bee.state.storageCap = 50;

  const res = bee.harvestHive(hive.id);
  assert.equal(res.ok, true);
  assert.ok(Math.abs(bee.state.materials.pollen - 80) < 1e-6);
  assert.ok(Math.abs(bee.state.materials.propolis - 25) < 1e-6);
  assert.ok(Math.abs(bee.state.materials.royalJelly - 4) < 1e-6);
  assert.ok(hive.byproducts.pollen < 1e-6);
  assert.ok(hive.byproducts.propolis < 1e-6);
  assert.ok(hive.byproducts.royalJelly < 1e-6);
});

test('6.6.1 Atölye 9. yerleşimciyle açılır ve premium kavanoz üretimi oyun zamanında tamamlanır', () => {
  const bee = freshGame();
  unlock(bee, 9);
  bee.state.storage.yonca = 5;
  bee.state.wax = 0.2;

  assert.equal(bee.workshopUnlocked(), true);
  assert.equal(bee.workshopLevel(), 1);
  assert.equal(bee.workshopActiveSlots(), 1);

  const queued = bee.enqueueWorkshop('premiumJar', 'yonca');
  assert.equal(queued.ok, true);
  assert.equal(bee.state.storage.yonca || 0, 0);
  assert.ok(Math.abs(bee.state.wax - 0.1) < 1e-6);
  assert.equal(bee.state.workshop.active.length, 1);

  bee.processWorkshop(DAY_MS);
  assert.equal(bee.state.workshop.active.length, 0);
  assert.equal(bee.state.workshop.products.premiumJars.yonca, 5);
});

test('6.4.0 Eczane ve Arıcılar Derneği atölye seviyelerini ve gelişmiş tarifleri açar', () => {
  const bee = freshGame();
  unlock(bee, 9);
  assert.equal(bee.workshopRecipe('propolisShield').unlock, false);

  unlock(bee, 44);
  assert.equal(bee.workshopLevel(), 2);
  assert.equal(bee.workshopRecipe('propolisShield').unlock, true);
  assert.equal(bee.workshopRecipe('pollenCake').unlock, false);

  unlock(bee, 53);
  assert.equal(bee.workshopLevel(), 3);
  assert.equal(bee.workshopActiveSlots(), 2);
  assert.equal(bee.workshopQueueCap(), 4);
  assert.equal(bee.workshopRecipe('pollenCake').unlock, true);
  assert.equal(bee.workshopRecipe('royalJellyCure').unlock, true);
});

test('6.4.0 atölye kovan ürünleri envanterden tüketilir ve gerçek mevcut etkiyi uygular', () => {
  const bee = freshGame();
  const hive = Object.values(bee.state.hives)[0];
  unlock(bee, 9);
  unlock(bee, 44);
  unlock(bee, 53);
  bee.state.workshop.products.pollenCake = 1;

  const before = hive.pollenCakeUntilDay || 0;
  const res = bee.useWorkshopProduct('pollenCake', hive.id);
  assert.equal(res.ok, true);
  assert.equal(bee.state.workshop.products.pollenCake, 0);
  assert.ok(hive.pollenCakeUntilDay >= Math.max(bee.dayIndex(), before) + 5);
});

test('6.4.0 atölye üretimi oyun durduğunda ilerlemez', () => {
  const bee = freshGame();
  unlock(bee, 9);
  bee.state.wax = 1;
  assert.equal(bee.enqueueWorkshop('candle').ok, true);
  const before = bee.state.workshop.active[0].remainingMs;

  bee.state.speed = 0;
  const now = Date.now();
  bee.lastTickAt = now - 5000;
  bee.tick(now);

  assert.equal(bee.state.workshop.active[0].remainingMs, before);
});

test('6.4.0 renderer gerçek Yan Ürün sekmesini ve Atölye arayüzünü içerir', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.css'), 'utf8');

  assert.ok(html.includes('id="h-by-pollen"'));
  assert.ok(html.includes('id="h-by-propolis"'));
  assert.ok(html.includes('id="h-by-royal"'));
  assert.ok(html.includes('id="workshop-modal"'));
  assert.ok(html.includes('id="workshop-recipes"'));
  assert.ok(html.includes('id="workshop-products"'));
  assert.match(js, /workshopQueue/);
  assert.match(js, /workshopUse/);
  assert.match(js, /workshopSell/);
  assert.match(css, /\.workshop-card/);
  assert.match(css, /\.byproduct-card/);
});

test('6.4.0 regression runs on 6.4.0 or newer', () => {
  const pkg = require('../package.json');
  const [major, minor] = pkg.version.split('.').map(Number);
  assert.ok(major > 6 || (major === 6 && minor >= 4));
});