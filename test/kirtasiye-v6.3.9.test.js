const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/skins.css'),'utf8');
const marker="6.3.9 — 90'LAR KIRTASİYE / PNG ASSET DENEMESİ";
const section=css.slice(css.indexOf(marker));

test("6.3.9 Kirtasiye uses real PNG assets and PNG paper backgrounds",()=>{
  assert.ok(section.length>0);
  for(const asset of ['kalemlik.png','kalemler.png','washi.png','yildiz.png','cicek.png','sticky.png','spiral-not.png','paper-grid.png','paper-lines.png','header-gingham.png']){
    assert.match(section,new RegExp(asset.replace('.','\\.')));
    assert.ok(fs.existsSync(path.join(root,'src/renderer/panel/deco/doksanlar-kirtasiye/png',asset)));
  }
  assert.doesNotMatch(section,/doksanlar-kirtasiye\/[^)"']*\.svg/);
  assert.doesNotMatch(section,/background-size:\s*cover/);
});
test("6.3.9 cannot break resize or move tabs",()=>{
  const panelCss=fs.readFileSync(path.join(root,'src/renderer/panel/panel.css'),'utf8');
  assert.match(panelCss,/\.grip\s*\{[^}]*position:\s*absolute/s);
  assert.match(section,/\.grip\{position:absolute\s*!important/);
  assert.doesNotMatch(section,/\.tabs\s*\{[^}]*\b(?:margin|padding|height|width|display|position|gap)\s*:/s);
});
test("6.3.9 keeps classic badge icons",()=>{
  const panel=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');
  assert.match(panel,/icon\.className = 'badge-icon';\s*icon\.textContent = a\.unlockedAt \? a\.icon : '\?';/s);
  assert.doesNotMatch(section,/badge-icon[^}]*background-image:/s);
});
