const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');

test('moodboard 7 eşit sütun ve sabit kompakt satır yüksekliği kullanır', () => {
  assert.match(css, /\.mood-calendar\s*\{[\s\S]*?grid-template-columns:\s*repeat\(7, minmax\(0, 1fr\)\);[\s\S]*?grid-auto-rows:\s*36px;[\s\S]*?row-gap:\s*6px;/);
  assert.match(css, /\.mood-day-wrap\s*\{[\s\S]*?height:\s*36px;/);
});

test('dar panelde moodboard 32px hücre ve 5px satır aralığına iner', () => {
  assert.match(css, /@container \(max-width: 420px\)[\s\S]*?\.mood-calendar \{[\s\S]*?grid-auto-rows:\s*32px;[\s\S]*?row-gap:\s*5px;/);
});

test('moodboard duygu dili görev zorluğu değil gün hissi anlatır', () => {
  assert.match(panel, /day\.value === 'green' \? 'muhteşem'/);
  assert.match(panel, /day\.value === 'yellow' \? 'idare eder'/);
  assert.match(panel, /day\.value === 'red' \? 'kötü'/);
  assert.match(panel, /\['green', 'Muhteşem'\]/);
  assert.match(panel, /\['yellow', 'İdare eder'\]/);
  assert.match(panel, /\['red', 'Kötü'\]/);
  assert.doesNotMatch(panel, /\['green', 'İyi'\]|\['yellow', 'Orta'\]|\['red', 'Zor'\]/);
});
