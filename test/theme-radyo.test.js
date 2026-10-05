const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { ThemeManager } = require('../src/main/themes');
const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'src/renderer/panel/skins.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.js'), 'utf8');

test('Radyo Nero yerleşik tema olarak yüklenir', () => {
  const m = new ThemeManager({ builtinDir:path.join(root,'themes'), userDir:path.join(os.tmpdir(),`nero-theme-empty-${process.pid}`) });
  const row=m.scan().find((x)=>x.id==='radyo');
  assert.ok(row); assert.equal(row.broken,false); assert.deepEqual(row.errors,[]);
  assert.equal(m.get('radyo').manifest.ui.skin,'radyo');
});

test('Radyo Nero yayın metaforu beş ana sayfaya yayılır', () => {
  assert.match(js,/brandTitle: 'Radyo Nero'/);
  assert.match(js,/ON AIR · 98\.6 FM/);
  assert.match(css,/REQUEST #/);
  assert.match(css,/PROGRAM RUNDOWN/);
  assert.match(css,/88   92   96   100   104   108 MHz/);
  assert.match(js,/badgeTitle: 'RADYO NERO ARŞİVİ'/);
});
