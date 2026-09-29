'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const w = require('../src/main/wardrobe');

test('6.3.3 exposes exactly the first ten Nero-native outfits', () => {
  const manifest = require('../themes/default/theme.json');
  assert.equal(w.ITEMS.length, 10);
  const ids = w.ITEMS.map((x) => x.id);
  assert.deepEqual(ids, [
    'daily-kot-ceket',
    'daily-cizgili-tisort',
    'daily-soft-yesil-hoodie',
    'daily-kamp-gunu',
    'daily-baharlik-gomlek',
    'daily-krem-hirka',
    'winter-kar-tanesi-kazagi',
    'winter-kis-montu',
    'sleep-pijamalari',
    'special-parti-kiyafeti'
  ]);
  for (const id of ids) {
    const rel = manifest.layers.outfit[id];
    assert.ok(rel, id);
    assert.match(rel, /^assets\/wardrobe-v2\/.+\.svg$/);
    const svg = fs.readFileSync(path.join(__dirname, '..', 'themes/default', rel), 'utf8');
    assert.match(svg, /viewBox="0 0 220 260"/);
    assert.match(svg, /#4A3A36/);
  }
});

test('night uses the redesigned pajamas and returns to daytime selection', () => {
  const s = { wardrobeOutfit: 'daily-kot-ceket', wardrobeSelectedNight: '' };
  const persist = (patch) => Object.assign(s, patch);
  assert.equal(w.choose(s, new Date(2026, 8, 28, 21, 1), persist).outfit, 'sleep-pijamalari');
  assert.equal(w.choose(s, new Date(2026, 8, 29, 5, 59), persist).outfit, 'sleep-pijamalari');
  assert.equal(w.choose(s, new Date(2026, 8, 29, 6), persist).outfit, 'daily-kot-ceket');
});

test('manual wardrobe click wins immediately for the current night', () => {
  const night = w.sleepNight(new Date(2026, 8, 28, 22));
  const s = {
    wardrobeOutfit: 'winter-kar-tanesi-kazagi',
    wardrobeSelectedNight: night,
    sleepNight: night,
    sleepOutfit: 'sleep-pijamalari'
  };
  assert.equal(w.choose(s, new Date(2026, 8, 28, 22), () => {}).outfit, 'winter-kar-tanesi-kazagi');
  assert.equal(w.choose(s, new Date(2026, 8, 29, 5), () => {}).outfit, 'winter-kar-tanesi-kazagi');
  assert.equal(w.choose(s, new Date(2026, 8, 29, 21), () => {}).outfit, 'sleep-pijamalari');
});

test('retired wardrobe ids are no longer valid', () => {
  assert.equal(w.VALID.has('daily-spor-gunu'), false);
  assert.equal(w.VALID.has('summer-limonata'), false);
  assert.equal(w.special(new Date(2026, 3, 1)), null);
});
