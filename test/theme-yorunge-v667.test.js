const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'src/renderer/panel/index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/yorunge-v667.css'),'utf8');
const js=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');

test('6.6.7 Yörünge pilotu beş sayfaya yapısal bileşenler ekler',()=>{
  for(const token of ['yorunge-home-hero','yorunge-log-hero','yorunge-control-hero','yorunge-timer-hero','yorunge-patch-hero']){
    assert.match(html,new RegExp(token));
  }
  assert.match(css,/YÖRÜNGE KONTROL MERKEZİ 6\.6\.7 — STRUCTURAL PILOT/);
  assert.match(css,/#view-timer\{display:grid/);
  assert.match(css,/#view-notes \.notes\{display:flex;flex-direction:column/);
  assert.match(css,/#view-badges \.badge-grid\{grid-template-columns:repeat\(5/);
});

test('Yörünge T-Zamanı gerçek açık işleri önizler',()=>{
  assert.match(js,/function renderYorungeFocusPreview/);
  assert.match(js,/yorunge-focus-preview/);
  assert.match(js,/activeTodos\.filter\(\(todo\) => !todo\.done\)\.slice\(0, 4\)/);
});

test('Nero görseli paketli tema protokolünden yüklenir ve oranı korunur',()=>{
  const asset=path.join(root,'themes/default/assets/wardrobe/outfit-space-17.png');
  assert.equal(fs.existsSync(asset),true);
  assert.match(html,/nero-theme:\/\/default\/assets\/wardrobe\/outfit-space-17\.png/);
  assert.match(css,/\.yorunge-nero\{[^}]*width:auto;[^}]*object-fit:contain/);
});

test('6.6.6 Yörünge selectorü pilot CSS içine sızmaz',()=>{
  assert.match(css,/\[data-skin="yorunge-v2"\]/);
  assert.doesNotMatch(css,/\[data-skin="yorunge"\]/);
});
