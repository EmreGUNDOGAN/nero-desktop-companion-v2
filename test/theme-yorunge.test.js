const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {ThemeManager}=require('../src/main/themes');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/yorunge-v667.css'),'utf8');
const js=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');

test('Yörünge Kontrol Merkezi built-in tema olarak yüklenir',()=>{
  const m=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:path.join(os.tmpdir(),`nero-theme-empty-${process.pid}`)});
  const row=m.scan().find(x=>x.id==='yorunge');
  assert.ok(row); assert.equal(row.broken,false); assert.deepEqual(row.errors,[]);
  assert.equal(m.get('yorunge').manifest.ui.skin,'yorunge-v2');
});

test('Yörünge teması retro görev kontrol metaforunu kullanır ve neon değildir',()=>{
  assert.match(js,/brandTitle: 'Yörünge Kontrol Merkezi'/);
  assert.match(js,/timerStart: 'INITIATE'/);
  assert.match(css,/MISSION LOG · N-066 · ORBITAL CONTROL/);
  assert.match(css,/FLIGHT CHECKLIST · MISSION N-066/);
  assert.match(css,/MISSION TIMER · N-066/);
  assert.match(js,/badgeTitle: 'MISSION PATCHES'/);
  assert.match(css,/#D8D2BE/);
  assert.match(css,/#C9672E/);
});
