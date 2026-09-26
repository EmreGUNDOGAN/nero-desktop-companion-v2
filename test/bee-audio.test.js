const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SOUND_DIR = path.join(__dirname, '../src/renderer/bee/sounds');
const EXPECTED = [
  'bell_1.ogg', 'bell_2.ogg',
  'birds_1.ogg', 'birds_2.ogg', 'birds_3.ogg',
  'coin.ogg',
  'error_1.ogg', 'error_2.ogg',
  'harvest_1.ogg', 'harvest_2.ogg',
  'loop_bees.ogg', 'loop_rain.ogg', 'loop_wind.ogg',
  'paper.ogg',
  'place_1.ogg', 'place_2.ogg', 'place_3.ogg', 'place_4.ogg',
  'plant.ogg',
  'success.ogg'
];

test('5.5.0 gerçek ses paketi tam 20 OGG içerir', () => {
  const actual = fs.readdirSync(SOUND_DIR).filter((x) => x.endsWith('.ogg')).sort();
  assert.deepEqual(actual, EXPECTED.slice().sort());
});

test('5.5.0 ses dosyalarının tamamı OggS başlığıyla başlar ve boş değildir', () => {
  for (const name of EXPECTED) {
    const p = path.join(SOUND_DIR, name);
    const data = fs.readFileSync(p);
    assert.ok(data.length > 1024, `${name} beklenenden küçük`);
    assert.equal(data.subarray(0, 4).toString('ascii'), 'OggS', `${name} geçerli OGG başlığı taşımıyor`);
  }
});

test('5.5.0 ses kaynak/lisans notu paketle birlikte tutulur', () => {
  const p = path.join(SOUND_DIR, 'KAYNAKLAR.md');
  assert.equal(fs.existsSync(p), true);
  const text = fs.readFileSync(p, 'utf8');
  assert.ok(text.trim().length > 20);
});
