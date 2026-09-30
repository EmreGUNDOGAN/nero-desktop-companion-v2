const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/skins.css'),'utf8');

test("6.3.8 90'lar Kırtasiye uses atomic assets instead of one cover scene",()=>{
  const start=css.indexOf("6.3.8 — 90'LAR KIRTASİYE");
  assert.ok(start>=0);
  const s=css.slice(start);
  for(const a of ['asset-pencilcase.svg','asset-pens.svg','asset-washi.svg','asset-sticky.svg','asset-clips.svg','asset-stickers.svg','asset-cassette.svg','asset-spiral.svg']){
    assert.match(s,new RegExp(a.replace('.','\\.')));
    assert.ok(fs.existsSync(path.join(root,'src/renderer/panel/deco/doksanlar-kirtasiye',a)));
  }
  const shellBlock=s.match(/\[data-skin="doksanlar-kirtasiye"\] \.shell::before \{[\s\S]*?\n\}/)?.[0] || '';
  assert.doesNotMatch(shellBlock,/background-size:\s*cover/);
  assert.match(shellBlock,/background-size:\s*25% auto/);
});

test("6.3.8 keeps resize and classic badge system intact",()=>{
  const panelCss=fs.readFileSync(path.join(root,'src/renderer/panel/panel.css'),'utf8');
  const panel=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');
  const s=css.slice(css.indexOf("6.3.8 — 90'LAR KIRTASİYE"));
  assert.match(panelCss,/\.grip\s*\{[^}]*position:\s*absolute/s);
  assert.match(s,/\.grip\s*\{[^}]*position:absolute\s*!important/s);
  assert.match(panel,/icon\.className = 'badge-icon';\s*icon\.textContent = a\.unlockedAt \? a\.icon : '\?';/s);
  assert.doesNotMatch(s,/badge-icon[^}]*background-image:/s);
});

test("6.3.8 uses the proven illustrated layout family without changing tab order",()=>{
  const html=fs.readFileSync(path.join(root,'src/renderer/panel/index.html'),'utf8');
  const order=['data-tab="home"','data-tab="notes"','data-tab="todos"','data-tab="timer"','data-tab="badges"'];
  let last=-1;
  for(const token of order){const i=html.indexOf(token); assert.ok(i>last); last=i;}
  assert.match(css,/\[data-skin="doksanlar-kirtasiye"\] \.tile \{/);
  assert.match(css,/\[data-skin="doksanlar-kirtasiye"\] \.week \{/);
});
