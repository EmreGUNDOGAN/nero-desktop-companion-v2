const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {ThemeManager}=require('../src/main/themes');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/skins.css'),'utf8');
const js=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');

test('Gece Ekspresi built-in tema olarak yüklenir',()=>{
  const m=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:path.join(os.tmpdir(),`nero-theme-empty-${process.pid}`)});
  const row=m.scan().find(x=>x.id==='gece-ekspresi');
  assert.ok(row); assert.equal(row.broken,false); assert.deepEqual(row.errors,[]);
  assert.equal(m.get('gece-ekspresi').manifest.ui.skin,'gece-ekspresi');
});

test('Gece Ekspresi rota, bilet, durak, saat ve hatıra metaforlarını taşır',()=>{
  assert.match(js,/brandTitle: 'Nero Gece Ekspresi'/);
  assert.match(js,/timerStart: 'HAREKET'/);
  assert.match(css,/YOLCULUK DEFTERİ · HAT 06/);
  assert.match(css,/DURAK ÇİZELGESİ · HAT 06/);
  assert.match(css,/İSTASYON SAATİ · PERON 06/);
  assert.match(js,/badgeTitle: 'SEYAHAT HATIRALARI'/);
});
