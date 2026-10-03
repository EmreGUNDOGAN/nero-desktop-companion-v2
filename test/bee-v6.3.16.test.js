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

function flowerize(bee, hiveId, flowers) {
  const hiveKey = bee.hiveTileKey(hiveId);
  const [q, r] = hiveKey.split(',').map(Number);
  const dirs = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  dirs.forEach(([dq, dr], i) => {
    const k = `${q + dq},${r + dr}`;
    const t = bee.state.tiles[k];
    if (!t) return;
    t.owned = true;
    t.kind = 'grass';
    t.item = flowers[i] ? { type: 'flower', flower: flowers[i], plantedDay: bee.dayIndex(), wilted: false } : null;
  });
}

test('6.3.16 biodiversity thresholds and monoculture rule are deterministic', () => {
  const bee = new BeeGame(new MemoryStore());
  const hive = Object.values(bee.state.hives)[0];

  flowerize(bee, hive.id, ['lavanta','papatya']);
  let eco = bee.hiveEcosystem(hive.id);
  assert.equal(eco.productionBonus, 0);
  assert.equal(eco.qualityBonus, 0.06);
  assert.equal(eco.level, 'Orta');
  assert.equal(eco.monoculture, false);

  flowerize(bee, hive.id, ['lavanta','papatya','yonca']);
  eco = bee.hiveEcosystem(hive.id);
  assert.equal(eco.productionBonus, 0);
  assert.equal(eco.qualityBonus, 0.12);
  assert.equal(eco.level, 'Yüksek');

  flowerize(bee, hive.id, ['lavanta','lavanta','lavanta','lavanta','lavanta','papatya']);
  eco = bee.hiveEcosystem(hive.id);
  assert.equal(eco.monoculture, true);
  assert.equal(eco.sicknessRiskMult, 1.15);
  assert.equal(eco.productionBonus, 0);
  assert.equal(eco.qualityBonus, -0.08);
});

test('6.6.1 biodiversity is shown as quality, not a second global production multiplier', () => {
  const bee = new BeeGame(new MemoryStore());
  const hive = Object.values(bee.state.hives)[0];
  flowerize(bee, hive.id, ['lavanta','papatya','yonca']);
  const effect = bee.hiveProductionEffects(hive.id).find((x) => x.label.includes('Biyoçeşitlilik'));
  assert.ok(effect);
  assert.equal(effect.mult, 1);
  assert.equal(effect.value, 'kalite');
});

test('6.3.16 hive panel exposes the five approved tabs and ecosystem explanations', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.css'), 'utf8');
  for (const tab of ['general','ecosystem','byproduct','production','details']) {
    assert.match(html, new RegExp('data-hive-tab="' + tab + '"'));
    assert.match(html, new RegExp('data-hive-panel="' + tab + '"'));
  }
  assert.match(renderer, /setHiveTab\(tab\)/);
  assert.match(renderer, /h-eco-dominant/);
  assert.match(renderer, /flowerEcosystem/);
  assert.match(renderer, /makePollinatorAccent/);
  assert.match(css, /\.hive-tabs/);
  assert.match(css, /\.eco-hero/);
});