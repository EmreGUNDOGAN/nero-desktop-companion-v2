const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const panelCss = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
const skinsCss = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/skins.css'), 'utf8');

test('ana sayfa istatistik kartları ortak temalarda kompakt kalır', () => {
  assert.match(panelCss, /\.tile\s*\{[\s\S]*?min-height:\s*86px;/);
  assert.match(panelCss, /\.bars\s*\{[\s\S]*?height:\s*76px;/);
  assert.doesNotMatch(panelCss, /\.tile\s*\{[\s\S]*?min-height:\s*110px;/);
});

test('özel temalar eski dev istatistik yüksekliklerini geri getirmez', () => {
  assert.match(skinsCss, /\[data-skin="disket"\] \.tile \{ min-height: 86px;/);
  assert.match(skinsCss, /\[data-skin="kasaba"\] \.tile \{ min-height: 82px;/);
  assert.match(skinsCss, /\[data-skin="yagmur"\], \[data-skin="kar"\]\) \.tile \{[\s\S]*?min-height: 88px;/);
  assert.match(skinsCss, /\[data-skin="cilek"\], \[data-skin="mum"\], \[data-skin="ege"\]\) \.tile \{[\s\S]*?min-height: 92px;/);
  assert.doesNotMatch(skinsCss, /min-height:\s*150px/);
  assert.doesNotMatch(skinsCss, /min-height:\s*128px/);
  assert.doesNotMatch(skinsCss, /grid-template-rows:\s*28px auto auto;\s*align-content:\s*start;\s*min-height:\s*110px/);
});

test('haftalık odak kartlarının tema yükseklikleri kontrollüdür', () => {
  assert.match(skinsCss, /\[data-skin="yagmur"\], \[data-skin="kar"\]\) \.week \{[\s\S]*?min-height: 116px;/);
  assert.match(skinsCss, /\[data-skin="cilek"\], \[data-skin="mum"\], \[data-skin="ege"\]\) \.week \{ min-height: 112px;/);
});
