const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const main = fs.readFileSync(path.join(root, 'src/main/main.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.css'), 'utf8');
const bee = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');

test('6.3.13 panel is natively resizable and keeps custom corner grips above themes', () => {
  const start = main.indexOf('function createPanelWindow()');
  const end = main.indexOf('function panelSize()', start);
  const block = main.slice(start, end);
  assert.match(block, /resizable:\s*true/);
  assert.match(block, /minWidth:\s*PANEL_MIN\.width/);
  assert.match(block, /minHeight:\s*PANEL_MIN\.height/);
  assert.match(block, /maxWidth:\s*PANEL_MAX\.width/);
  assert.match(block, /maxHeight:\s*PANEL_MAX\.height/);
  assert.match(block, /panelWin\.on\('resized'/);
  assert.match(css, /\.grip\s*\{[\s\S]*?z-index:\s*5000\s*!important/);
  assert.match(css, /\.grip\s*\{[\s\S]*?pointer-events:\s*auto\s*!important/);
  assert.match(css, /\.grip\s*\{[\s\S]*?-webkit-app-region:\s*no-drag/);
});

test('6.3.13 automatic release notes cannot reopen on each running game state tick', () => {
  assert.match(bee, /let whatsNewAutoAttempted = false/);
  assert.match(bee, /let whatsNewAutoShowing = false/);
  assert.match(bee, /if \(whatsNewAutoAttempted \|\| whatsNewAutoShowing/);
  assert.match(bee, /whatsNewAutoAttempted = true/);
  assert.match(bee, /writeSeenVersion\(current\.version\)/);
  assert.match(bee, /if \(e\.target !== \$\('whats-new-modal'\)\) return/);
});
