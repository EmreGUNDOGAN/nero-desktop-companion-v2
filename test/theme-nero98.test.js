const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { ThemeManager } = require('../src/main/themes');

const root = path.join(__dirname, '..');
const skinsCss = fs.readFileSync(path.join(root, 'src/renderer/panel/skins.css'), 'utf8');
const panelJs = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.js'), 'utf8');

test('Nero OS 98 varsayılan karakter katmanlarını miras alır ve bozuk görünmez', () => {
  const manager = new ThemeManager({
    builtinDir: path.join(root, 'themes'),
    userDir: path.join(os.tmpdir(), `nero-theme-empty-${process.pid}`)
  });
  const listed = manager.scan();
  const row = listed.find((t) => t.id === 'nero98');
  assert.ok(row, 'nero98 tema listesinde olmalı');
  assert.equal(row.broken, false);
  assert.deepEqual(row.errors, []);

  const theme = manager.get('nero98');
  assert.equal(theme.manifest.ui.skin, 'nero98');
  assert.match(theme.manifest.layers.body.default.url, /^nero-theme:\/\/default\/assets\/body\.svg$/);
  assert.match(theme.manifest.layers.eyes.default.url, /^nero-theme:\/\/default\/assets\/eyes\.svg$/);
});

test('Nero OS 98 beş ana sayfayı ve kontrol panelini ayrı skin kurallarıyla dönüştürür', () => {
  assert.match(skinsCss, /\[data-skin="nero98"\] \.tabs/);
  assert.match(skinsCss, /Nero Notepad/);
  assert.match(skinsCss, /TASKMGR\.EXE/);
  assert.match(skinsCss, /NERO TIMER/);
  assert.match(skinsCss, /ACHIEVEMENTS\.EXE/);
  assert.match(skinsCss, /CONTROL PANEL/);
  assert.match(panelJs, /brandTitle: 'Nero OS'/);
  assert.match(panelJs, /beeLabel: 'HIVE\.EXE'/);
});
