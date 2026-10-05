const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {ThemeManager}=require('../src/main/themes');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/skins.css'),'utf8');
const js=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');

test('Tamir Tezgâhı built-in tema olarak yüklenir',()=>{
  const m=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:path.join(os.tmpdir(),`nero-theme-empty-${process.pid}`)});
  const row=m.scan().find(x=>x.id==='tamir');
  assert.ok(row); assert.equal(row.broken,false); assert.deepEqual(row.errors,[]);
  assert.equal(m.get('tamir').manifest.ui.skin,'tamir');
});

test('Tamir Tezgâhı servis fişi, iş emri, işçilik ve ustalık metaforlarını taşır',()=>{
  assert.match(js,/brandTitle: 'Nero Tamir & Bakım'/);
  assert.match(js,/timerStart: 'ÇALIŞMAYA BAŞLA'/);
  assert.match(css,/NERO TAMİR & BAKIM · SERVİS KABUL FİŞİ/);
  assert.match(css,/TAMİR SIRASI · İŞ EMİRLERİ/);
  assert.match(css,/İŞÇİLİK SÜRESİ · TEZGÂH 01/);
  assert.match(js,/badgeTitle: 'USTALIK PANOSU'/);
});
