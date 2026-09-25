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

test('5.5.3 Yonca yüzde 5 ve Papatya yüzde 10 üretim bonusu verir', () => {
  assert.equal(FLOWERS.yonca.buff, 0.05);
  assert.equal(FLOWERS.papatya.buff, 0.10);
});

test('5.5.3 mağazadan alınan tohum envantere girer ve ekimde ikinci kez para alınmaz', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.coins = 1000;
  const flower = 'yonca';
  const cost = bee.seedCost(flower);
  const before = bee.state.coins;

  const buy = bee.buySeed(flower);
  assert.equal(buy.ok, true);
  assert.equal(bee.state.vouchers[flower], 1);
  assert.equal(bee.state.coins, before - cost);

  const emptyKey = Object.entries(bee.state.tiles)
    .find(([, t]) => t.owned && t.kind === 'grass' && !t.item)[0];
  const beforePlant = bee.state.coins;
  const plant = bee.plantSeed(emptyKey, flower);

  assert.equal(plant.ok, true);
  assert.equal(bee.state.vouchers[flower], 0);
  assert.equal(bee.state.coins, beforePlant);
  assert.equal(bee.state.tiles[emptyKey].item.flower, flower);
});

test('5.5.3 Yenilikler penceresi ve tekrar açma girişi rendererda bulunur', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const notes = fs.readFileSync(path.join(root, 'src/renderer/bee/release-notes.js'), 'utf8');

  assert.ok(html.includes('id="whats-new-modal"'));
  assert.ok(html.includes('id="open-whats-new"'));
  assert.ok(html.includes('Çiftliğe Dön'));
  assert.match(js, /neroBeeLastReleaseSeen/);
  assert.match(js, /maybeShowWhatsNew/);
  assert.match(notes, /version: '5\.5\.3'/);
});

test('5.5.3 görevler tamamlanınca kompakt ikon düzeni korunur', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.css'), 'utf8');

  assert.ok(html.includes('class="task-bell" id="quests-icon"'));
  assert.match(js, /allClaimed && questsOpen/);
  assert.match(js, /setQuestsOpen\(false\)/);
  assert.match(css, /\.task-bell\.done/);
});

test('5.5.3 mağaza tohumu yerleştirme moduna sokmak yerine buySeed çağırır', () => {
  const src = fs.readFileSync(path.join(__dirname, '../src/renderer/bee/bee.js'), 'utf8');
  assert.match(src, /doAct\('buySeed', b\.dataset\.flower\)/);
  assert.doesNotMatch(src, /if \(kind === 'seed'\) startPlacing/);
  assert.match(src, /🌱 Envanter:/);
});
