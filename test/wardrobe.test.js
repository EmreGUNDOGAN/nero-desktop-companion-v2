'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const w = require('../src/main/wardrobe');

test('all approved wardrobe entries resolve to the original full-character wardrobe artwork', () => {
  const manifest = require('../themes/default/theme.json');
  assert.equal(w.ITEMS.length, 72);
  for (const id of [...w.ITEMS.map((x) => x.id), ...w.SLEEP.map((_, i) => `sleep-${i}`), ...Object.values(w.SPECIAL).map((id) => `special-${id}`), 'special-birthday']) {
    const rel = manifest.layers.outfit[id];
    assert.ok(rel, id);
    assert.match(rel, /\.png$/);
    const png = fs.readFileSync(path.join(__dirname, '..', 'themes/default', rel));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 220);
    assert.equal(png.readUInt32BE(20), 260);
  }
});


test('nightly sleepwear stays chosen through midnight and application restart', () => {
  const s = { birthday: '', wardrobeOutfit: w.ITEMS[0].id };
  const persist = (patch) => Object.assign(s, patch);
  assert.equal(w.choose(s, new Date(2026, 8, 28, 21, 1), persist, () => 0.75).outfit, 'sleep-6');
  assert.equal(w.choose(s, new Date(2026, 8, 29, 5, 59), persist, () => 0).outfit, 'sleep-6');
  assert.equal(w.choose(s, new Date(2026, 8, 29, 6), persist).outfit, w.ITEMS[0].id);
  assert.equal(w.choose(s, new Date(2026, 8, 29, 21), persist, () => 0).outfit, 'sleep-0');
});

test('a wardrobe click changes Nero immediately at night, then pajamas resume next night', () => {
  const outfit = w.ITEMS[5].id;
  const night = w.sleepNight(new Date(2026, 8, 28, 22));
  const s = { birthday: '', wardrobeOutfit: outfit, wardrobeSelectedNight: night };
  const persist = (patch) => Object.assign(s, patch);
  assert.equal(w.choose(s, new Date(2026, 8, 28, 22), persist).outfit, outfit);
  assert.equal(w.choose(s, new Date(2026, 8, 29, 5), persist).outfit, outfit);
  assert.equal(w.choose(s, new Date(2026, 8, 29, 21), persist, () => 0).outfit, 'sleep-0');
});

test('special-day clothing overrides sleepwear and restores previous choice', () => {
  const s = { birthday: '05-20', wardrobeOutfit: w.ITEMS[1].id };
  assert.equal(w.choose(s, new Date(2026, 4, 20, 23), () => {}).outfit, 'special-birthday');
  assert.equal(w.choose(s, new Date(2026, 4, 21, 12), () => {}).outfit, w.ITEMS[1].id);
  assert.equal(w.choose({ ...s, birthday: '' }, new Date(2026, 3, 1, 10), () => {}).outfit, 'special-april');
});
