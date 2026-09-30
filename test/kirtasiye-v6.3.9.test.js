const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'src/renderer/panel/skins.css'),'utf8');
const section=css.slice(css.indexOf("6.3.9 — 90'LAR KIRTASİYE"));
const pngDir=path.join(root,'src/renderer/panel/deco/doksanlar-kirtasiye/png');
const required=["baslik.png","bg-bugun.png","bg-notlar.png","bg-isler.png","bg-sayac.png","bg-rozetler.png","asset-pencilcase.png","asset-pens.png","asset-washi.png","asset-binder.png","asset-clip.png","asset-flower.png","asset-star.png","asset-sticky.png","asset-notepad.png","asset-torn-note.png","note-card-pink.png","note-card-mint.png","note-card-lilac.png","note-card-blue.png","note-card-yellow.png"];

test("6.3.9 Kirtasiye ships real PNG assets",()=>{
  assert.ok(section.length>0);
  for(const name of required){
    const p=path.join(pngDir,name);
    assert.ok(fs.existsSync(p),'missing '+name);
    assert.equal(fs.readFileSync(p).subarray(0,8).toString('hex'),'89504e470d0a1a0a',name+' is not PNG');
  }
});

test("6.3.9 wires a different PNG background to each main view",()=>{
  for(const file of ['bg-bugun.png','bg-notlar.png','bg-isler.png','bg-sayac.png','bg-rozetler.png']) {
    assert.match(section,new RegExp(file.replace('.','\\.')));
  }
  assert.match(section,/baslik\.png/);
  assert.match(section,/note-card-pink\.png/);
  assert.match(section,/asset-pencilcase\.png/);
});

test("6.3.9 disables the failed SVG composition and protects resize",()=>{
  assert.match(section,/\.shell::before\s*\{[\s\S]*?display:\s*none\s*!important/);
  assert.match(section,/\.grip\s*\{[^}]*position:\s*absolute\s*!important/s);
  assert.doesNotMatch(section,/\.tabs\s*\{[^}]*\b(?:margin|padding|height|width|display|position|gap)\s*:/s);
});

test("6.3.9 keeps classic badge icons",()=>{
  const panel=fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');
  assert.match(panel,/icon\.className = 'badge-icon';\s*icon\.textContent = a\.unlockedAt \? a\.icon : '\?';/s);
  assert.doesNotMatch(section,/badge-icon[^}]*background-image:/s);
});
