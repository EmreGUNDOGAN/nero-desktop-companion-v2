const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {ThemeManager}=require('../src/main/themes');

const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/yorunge-v667.css'),'utf8');
const legacy=fs.readFileSync(path.join(root,'src/renderer/panel/skins.css'),'utf8');
const js=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');

test('Yörünge Kontrol Merkezi yorunge-v2 skin ile izole yüklenir',()=>{
  const m=new ThemeManager({
    builtinDir:path.join(root,'themes'),
    userDir:path.join(os.tmpdir(),`nero-theme-empty-${process.pid}`)
  });
  const row=m.scan().find(x=>x.id==='yorunge');
  assert.ok(row);
  assert.equal(row.broken,false);
  assert.deepEqual(row.errors,[]);
  assert.equal(m.get('yorunge').manifest.ui.skin,'yorunge-v2');
  assert.match(js,/'yorunge-v2': \{/);
});

test('Yörünge v2 kendi bağımsız görev kontrol kabuğunu kullanır',()=>{
  assert.match(css,/\[data-skin="yorunge-v2"\] \.shell/);
  assert.match(css,/\[data-skin="yorunge-v2"\] \.top/);
  assert.match(css,/\[data-skin="yorunge-v2"\] \.tabs/);
  assert.match(css,/#cf5d1d/i);
  assert.match(css,/#152438/i);
  assert.doesNotMatch(css,/\[data-skin="yorunge"\]/);
  assert.doesNotMatch(legacy,/\[data-skin="yorunge"\]/);
});
