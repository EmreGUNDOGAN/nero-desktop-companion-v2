const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { BeeGame } = require('../src/main/bee');
const root = path.join(__dirname, '..');
const rd = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const html = rd('src/renderer/bee/index.html');
const js = rd('src/renderer/bee/bee.js');
const css = rd('src/renderer/bee/bee.css');
const mod = rd('src/renderer/bee/gorsel/cicekci-ici.js');
class Mem { constructor() { this.value = null; } get() { return this.value; } set(v) { this.value = JSON.parse(JSON.stringify(v)); } flush() {} }

test('Ezgi binasına tıklanınca dükkân içi açılır', () => {
  assert.match(html, /id="florist-modal"/);
  assert.match(js, /view\.ezgi\?\.unlocked\) \{ openFlorist\(\); return; \}/);
  assert.match(js, /function renderFlorist\(force = false\)/);
});
test('dükkân içi oyunun kendi 3D kitiyle ve izometrik kamerayla çizilir', () => {
  assert.match(mod, /from '\.\.\/evler\/kit\.js'/);
  assert.match(mod, /OrthographicCamera/);
  assert.doesNotMatch(mod, /\.svg/);
  assert.match(css, /\.florist-card\{/);
});
test('Ezgi\'nin 3 ürünü tezgâhta sergilenir ve gerçek pazar satın alma eylemine bağlanır', () => {
  for (const id of ['driedLavender', 'thymeBundle', 'flowerMix']) assert.match(mod, new RegExp(id));
  assert.match(js, /doAct\('marketBuyInput', input\.id\)/);
  assert.match(js, /\(view\?\.shopMarket \|\| \[\]\)\.find\(\(s\) => s\.id === 'cicekci'\)/);
});
test('Ezgi geldiğinde motor 3 ürünü fiyat ve stokla verir; satın alma çalışır', () => {
  const g = new BeeGame(new Mem());
  g.state.village.arrived = [1, 2, 3, 4, 5, 6, 7];
  g.state.coins = 1000;
  const v = g.view();
  assert.equal(v.ezgi.unlocked, true);
  const shop = v.shopMarket.find((s) => s.id === 'cicekci');
  assert.equal(shop.inputs.length, 3);
  assert.deepEqual(shop.inputs.map((i) => i.id), ['driedLavender', 'thymeBundle', 'flowerMix']);
  for (const i of shop.inputs) assert.ok(i.price > 0 && i.stock > 0);
  const res = g.buyMarketInput('thymeBundle', 1);
  assert.equal(res.ok, true);
  assert.equal(g.view().shopMarket.find((s) => s.id === 'cicekci').inputs[1].owned, 1);
});
