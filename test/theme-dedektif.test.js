const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {ThemeManager}=require('../src/main/themes');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/skins.css'),'utf8');
const js=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');

test('Dedektiflik Bürosu built-in tema olarak yüklenir',()=>{
  const m=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:path.join(os.tmpdir(),`nero-theme-empty-${process.pid}`)});
  const row=m.scan().find(x=>x.id==='dedektif');
  assert.ok(row); assert.equal(row.broken,false); assert.deepEqual(row.errors,[]);
  assert.equal(m.get('dedektif').manifest.ui.skin,'dedektif');
});

test('Dedektiflik Bürosu dosya ve ipucu metaforlarını birbirinden ayırır',()=>{
  assert.match(js,/brandTitle: 'Nero Dedektiflik Bürosu'/);
  assert.match(js,/timerStart: 'TAKİBE AL'/);
  assert.match(css,/VAKA RAPORU · NERO ÖZEL ARAŞTIRMALAR/);
  assert.match(css,/AKTİF İPUÇLARI · VAKA TAKİBİ/);
  assert.match(css,/TAKİP SAATİ · DOSYA AKTİF/);
  assert.match(js,/badgeTitle: 'DELİL ARŞİVİ'/);
});
