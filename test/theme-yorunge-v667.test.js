const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'src/renderer/panel/index.html'),'utf8');
const baseCss=fs.readFileSync(path.join(root,'src/renderer/panel/yorunge-v667.css'),'utf8');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/yorunge-v677.css'),'utf8');
const js=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');

const asset=(...p)=>path.join(root,'src/renderer/panel/deco/yorunge-v677',...p);

test('6.7.7 Yörünge asset-first tasarımı beş sayfayı ayrı kompozisyonlara dönüştürür',()=>{
  for(const token of ['yorunge-home-hero','yorunge-log-hero','yorunge-control-hero','yorunge-timer-hero','yorunge-patch-hero']) assert.match(html,new RegExp(token));
  assert.match(html,/yorunge-v677\.css/);
  assert.match(css,/YÖRÜNGE KONTROL MERKEZİ — ASSET-FIRST UI \/ Nero 6\.7\.7/);
  assert.match(css,/#view-timer\{[\s\S]*?display:grid/);
  assert.match(css,/#view-notes \.notes\{display:flex;flex-direction:column/);
  assert.match(css,/#view-badges \.badge-grid\{grid-template-columns:repeat\(4/);
});

test('6.7.7 görsel kimliği runtime çizimi yerine paketli SVG assetleri kullanır',()=>{
  const required=[
    ['home','hero-space-bg.svg'],['home','control-desk-overlay.svg'],['home','crew-monitor-frame.svg'],['home','sticky-mission-note.svg'],
    ['nero','nero-space-console.svg'],['logs','hero-bg.svg'],['control','hero-bg.svg'],['control','switch-bank.svg'],['timer','hero-bg.svg'],
    ['badges','hero-bg.svg'],['badges','patch-frame.svg'],['icons','tab-home.svg'],['icons','tab-logs.svg'],['icons','tab-control.svg'],['icons','tab-timer.svg'],['icons','tab-patches.svg']
  ];
  for(const p of required) assert.equal(fs.existsSync(asset(...p)),true,`missing asset ${p.join('/')}`);
  assert.match(css,/deco\/yorunge-v677\/home\/hero-space-bg\.svg/);
  assert.match(css,/deco\/yorunge-v677\/logs\/hero-bg\.svg/);
  assert.match(css,/deco\/yorunge-v677\/control\/hero-bg\.svg/);
  assert.match(css,/deco\/yorunge-v677\/timer\/hero-bg\.svg/);
  assert.match(css,/deco\/yorunge-v677\/badges\/hero-bg\.svg/);
});

test('Yörünge T-Zamanı gerçek açık işleri önizler',()=>{
  assert.match(js,/function renderYorungeFocusPreview/);
  assert.match(js,/yorunge-focus-preview/);
  assert.match(js,/activeTodos\.filter\(\(todo\) => !todo\.done\)\.slice\(0, 4\)/);
});

test('Nero görseli ayrı transparan assettir ve oranı korunur',()=>{
  assert.equal(fs.existsSync(asset('nero','nero-space-console.svg')),true);
  assert.match(html,/deco\/yorunge-v677\/nero\/nero-space-console\.svg/);
  assert.match(css,/\.yorunge-nero\{[\s\S]*?width:auto;[\s\S]*?object-fit:contain/);
});

test('eski 6.6.6 Yörünge selectorü yeni dosyalara sızmaz',()=>{
  assert.match(baseCss,/\[data-skin="yorunge-v2"\]/);
  assert.match(css,/\[data-skin="yorunge-v2"\]/);
  assert.doesNotMatch(baseCss,/\[data-skin="yorunge"\]/);
  assert.doesNotMatch(css,/\[data-skin="yorunge"\]/);
});
