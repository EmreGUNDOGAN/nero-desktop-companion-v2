'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

test('6.7.10 paket sürümü doğrudur', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(pkg.version, '6.7.10');
});

test('6.7.10 wardrobe çekirdek dosyaları vardır', () => {
  for (const rel of [
    'src/main/wardrobe.js',
    'src/renderer/character/wardrobe-renderer.js',
    'scripts/build-wardrobe.js',
    'themes/default/assets/wardrobe/catalog.json'
  ]) {
    assert.equal(fs.existsSync(path.join(ROOT, rel)), true, rel);
  }
});

test('6.7.10 wardrobe kataloğunda 88 kıyafet vardır', () => {
  const catalog = JSON.parse(fs.readFileSync(
    path.join(ROOT, 'themes/default/assets/wardrobe/catalog.json'),
    'utf8'
  ));
  assert.equal(Object.keys(catalog).length, 88 + require('../src/main/wardrobe-additions.json').length);
});

test('6.7.10 wardrobe asset paketi eksik değildir', () => {
  const dir = path.join(ROOT, 'themes/default/assets/wardrobe');
  let count = 0;
  const walk = p => {
    for (const name of fs.readdirSync(p)) {
      const full = path.join(p, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full);
      else count += 1;
    }
  };
  walk(dir);
  assert.ok(count >= 2000, 'wardrobe asset count: ' + count);
});
