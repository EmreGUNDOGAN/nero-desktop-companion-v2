const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const removed=['bakanlik','radyo','son-seans','gece-ekspresi','dedektif','yorunge-v2','tamir'];

test('6.7.8 kaldırılan tasarımları runtime kaynaklarından temizler',()=>{
 const js=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');
 const css=fs.readFileSync(path.join(root,'src/renderer/panel/skins.css'),'utf8');
 const html=fs.readFileSync(path.join(root,'src/renderer/panel/index.html'),'utf8');
 for(const id of removed){ assert.doesNotMatch(js,new RegExp(`['\"]${id}['\"]\\s*:`)); assert.doesNotMatch(css,new RegExp(`data-skin=[\"']${id}[\"']`)); }
 assert.doesNotMatch(html,/yorunge-v66|yorunge-v67|yorunge-only|deco\/yorunge/i);
});

test('6.7.8 kaldırılan tema klasörleri ve özel Yörünge dosyaları yoktur',()=>{
 for(const id of ['bakanlik','radyo','son-seans','gece-ekspresi','dedektif','tamir']) assert.equal(fs.existsSync(path.join(root,'themes',id)),false,id);
 const newTheme=JSON.parse(fs.readFileSync(path.join(root,'themes/yorunge/theme.json'),'utf8'));
 assert.equal(newTheme.name,'Yörünge');assert.equal(newTheme.inherits,'default');assert.equal(newTheme.ui.skin,'yorunge');
 assert.equal(fs.existsSync(path.join(root,'src/renderer/panel/yorunge-v667.css')),false);
 assert.equal(fs.existsSync(path.join(root,'src/renderer/panel/yorunge-v677.css')),false);
 assert.equal(fs.existsSync(path.join(root,'src/renderer/panel/deco/yorunge-v677')),false);
});
