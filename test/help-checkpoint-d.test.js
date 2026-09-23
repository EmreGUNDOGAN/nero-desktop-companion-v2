const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
const skins = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/skins.css'), 'utf8');
const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');

test('yardım tooltipi shell dışında body seviyesinde tek root katmandadır', () => {
  assert.match(html, /<div class="section-tooltip-layer" id="section-tooltip-layer" role="tooltip" hidden><\/div>/);
  assert.match(html, /<\/div>\s*<div class="section-tooltip-layer" id="section-tooltip-layer"/);
  assert.match(css, /\.section-tooltip-layer\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?z-index:\s*10000;/);
  assert.match(css, /max-width:\s*min\(220px, calc\(100vw - 24px\)\)/);
});

test('yardım ikonları küçük, borderless ve transparandır', () => {
  assert.match(css, /\.section-help\s*\{[\s\S]*?width:\s*19px; height:\s*19px;[\s\S]*?border:\s*0 !important;[\s\S]*?background:\s*transparent !important;/);
  assert.match(skins, /\[data-skin\] \.section-help\s*\{[\s\S]*?width:\s*19px !important;[\s\S]*?border:\s*0 !important;[\s\S]*?background:\s*transparent !important;/);
});

test('tooltip tek aktif katman kullanır ve viewport içinde clamp edilir', () => {
  assert.match(panel, /const sectionTooltipLayer = \$\('section-tooltip-layer'\)/);
  assert.match(panel, /function positionSectionTooltip\(button\)/);
  assert.match(panel, /Math\.max\(pad, Math\.min\(left, window\.innerWidth - tip\.width - pad\)\)/);
  assert.match(panel, /if \(top \+ tip\.height > window\.innerHeight - pad\)/);
  assert.match(panel, /sectionTooltipLayer\.textContent = source\.textContent\.trim\(\)/);
  assert.match(panel, /sectionTooltipLayer\.hidden = false/);
  assert.match(panel, /pinnedSectionHelp/);
});
