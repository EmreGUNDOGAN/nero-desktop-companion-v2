const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
const panelCss = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
const skinsCss = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/skins.css'), 'utf8');

test('başlık kontrolleri manual drag yüzeyinden ayrıdır ve tıklanabilir kalır', () => {
  assert.match(html, /class="panel-drag-zone"/);
  assert.match(html, /class="window-controls"[^>]*role="group"/);
  const dragAt = html.indexOf('class="panel-drag-zone"');
  const controlsAt = html.indexOf('class="window-controls"');
  const headerAt = html.indexOf('<header class="top">');
  assert.ok(dragAt > 0 && controlsAt > dragAt && headerAt > controlsAt, 'drag-zone + controls header dışında sibling olmalı');
  for (const id of ['settings-button', 'pin', 'minimize', 'close']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(panelCss, /\.top\s*\{[\s\S]*?-webkit-app-region:\s*no-drag;/);
  assert.match(panelCss, /\.panel-drag-zone\s*\{[\s\S]*?-webkit-app-region:\s*no-drag;[\s\S]*?right:\s*290px;[\s\S]*?cursor:\s*move;/);
  assert.match(panelCss, /\.window-controls\s*\{[\s\S]*?-webkit-app-region:\s*no-drag;[\s\S]*?z-index:\s*1000\s*!important;/);
  assert.match(panelCss, /\.window-controls,\s*\n\.window-controls \*\s*\{[\s\S]*?pointer-events:\s*auto;/);
  assert.match(panelCss, /\.window-controls > \.close\s*\{[\s\S]*?position:\s*static\s*!important;/);
  assert.match(skinsCss, /\.top::after\s*\{[\s\S]*?pointer-events:\s*none\s*!important;/);
});

test('resimli ve hava temalarında stat metinleri temiz iki satırlı düzene geçer', () => {
  assert.match(skinsCss, /\[data-skin="yagmur"\][\s\S]*?\[data-skin="ege"\]\) \.tile \{[\s\S]*?grid-template-columns:\s*34px minmax\(0, 1fr\);/);
  assert.match(skinsCss, /\.tile::before\s*\{[\s\S]*?grid-row:\s*1 \/ span 2;/);
  assert.match(skinsCss, /\.tile strong\s*\{[\s\S]*?justify-self:\s*start;/);
  assert.match(skinsCss, /\.tile span\s*\{[\s\S]*?justify-self:\s*start;/);
});
