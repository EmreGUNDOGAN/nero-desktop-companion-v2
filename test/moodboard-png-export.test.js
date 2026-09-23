const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('aylık PNG export Chromium capturePage yardımcı modülünü kullanır', () => {
  const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const image = fs.readFileSync(path.join(__dirname, '../src/main/moodboard-image.js'), 'utf8');
  assert.match(main, /require\('\.\/moodboard-image'\)/);
  assert.match(main, /await svgToPng\(/);
  assert.doesNotMatch(main, /nativeImage\.createFromDataURL\(`data:image\/svg\+xml/);
  assert.match(image, /new BrowserWindow\(/);
  assert.match(image, /capturePage\(/);
  assert.match(image, /toPNG\(\)/);
});
