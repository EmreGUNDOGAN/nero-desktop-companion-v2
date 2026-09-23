const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
const character = fs.readFileSync(path.join(__dirname, '../src/renderer/character/character.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');
const preload = fs.readFileSync(path.join(__dirname, '../src/preload/preload.js'), 'utf8');

test('panel drag native app-region kullanmaz ve window controls ile çakışmaz', () => {
  assert.match(css, /\.top\s*\{[\s\S]*?-webkit-app-region:\s*no-drag;/);
  assert.match(css, /\.panel-drag-zone\s*\{[\s\S]*?-webkit-app-region:\s*no-drag;[\s\S]*?right:\s*205px;/);
  assert.match(css, /\.window-controls\s*\{[\s\S]*?z-index:\s*1000\s*!important;/);
});

test('panel drag her gesture için start/end IPC kullanır ve kayıp pointer stateini temizler', () => {
  assert.match(panel, /panelDragZone\.addEventListener\('pointerdown'/);
  assert.match(panel, /if \(panelDragActive\) endPanelDrag/);
  assert.match(panel, /lostpointercapture/);
  assert.match(panel, /window\.addEventListener\('blur'/);
  assert.match(panel, /api\.send\('panel:dragStart'\)/);
  assert.match(panel, /api\.send\('panel:dragEnd'\)/);
  assert.match(preload, /'panel:dragStart', 'panel:dragEnd'/);
});

test('ana süreç paneli ve Nero karakterini aynı cursor delta ile taşır', () => {
  assert.match(main, /function startPanelDrag\(\)/);
  assert.match(main, /screen\.getCursorScreenPoint\(\)/);
  assert.match(main, /panelWin\.setBounds\(nextPanel\)/);
  assert.match(main, /charWin\.setBounds\(\{[\s\S]*?panelDrag\.charStart\.x \+ dx/);
  assert.match(main, /function stopPanelDrag\(\)/);
  assert.match(main, /ipcMain\.on\('panel:dragStart'/);
  assert.match(main, /ipcMain\.on\('panel:dragEnd'/);
});

test('Nero drag eski gesture takılı kalsa da yeniden başlayabilir', () => {
  assert.match(main, /function startDrag\(\)[\s\S]*?settings\(\)\.lockPosition/);
  assert.match(main, /if \(drag\) stopDrag\(\)/);
  assert.match(character, /function cancelPointerGesture\(\)/);
  assert.match(character, /press && \(e\.buttons & 1\) === 0/);
  assert.match(character, /if \(press \|\| dragging\) cancelPointerGesture\(\)/);
  assert.match(character, /lostpointercapture/);
  assert.match(character, /window\.addEventListener\('blur', cancelPointerGesture\)/);
});

test('kilit açıldığında drag engellenir ve aktif gesture kapanır', () => {
  assert.match(main, /case 'lockPosition':[\s\S]*?if \(value\)[\s\S]*?if \(drag\) stopDrag\(\);[\s\S]*?if \(panelDrag\) stopPanelDrag\(\)/);
  assert.match(panel, /state\?\.settings\?\.lockPosition/);
});
