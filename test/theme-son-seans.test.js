const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { ThemeManager } = require('../src/main/themes');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/skins.css'),'utf8');
const js=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');

test('Son Seans Sineması built-in tema olarak yüklenir',()=>{
  const m=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:path.join(os.tmpdir(),`nero-theme-empty-${process.pid}`)});
  const row=m.scan().find(x=>x.id==='son-seans');
  assert.ok(row); assert.equal(row.broken,false); assert.deepEqual(row.errors,[]);
  assert.equal(m.get('son-seans').manifest.ui.skin,'son-seans');
});

test('Son Seans senaryo, çekim, seans ve ödül metaforlarını taşır',()=>{
  assert.match(js,/brandTitle: 'Son Seans'/);
  assert.match(js,/timerStart: 'MOTOR'/);
  assert.match(css,/SENARYO · SON SEANS/);
  assert.match(css,/ÇEKİM LİSTESİ · MOTOR \/ KES/);
  assert.match(css,/SEANSA KALAN · SALON 01/);
  assert.match(css,/Ödül duvarı/);
});
