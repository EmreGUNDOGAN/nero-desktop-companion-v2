'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const w=require('../src/main/wardrobe'),Renderer=require('../src/renderer/character/wardrobe-renderer');
const catalog=require('../themes/default/assets/wardrobe/catalog.json');
const tick=()=>new Promise(r=>setImmediate(r));
test('88 complete outfits have independent blink/talk layers and accepted winter contour',()=>{
 const ids=new Set([...w.ITEMS.map(x=>x.id),...w.SLEEP.map((_,i)=>`sleep-${i}`),...Object.values(w.SPECIAL).map(x=>`special-${x}`),'special-birthday']);
 assert.equal(w.ITEMS.length,72);assert.equal(ids.size,88);assert.deepEqual(new Set(Object.keys(catalog)),ids);
 for(const id of ids){
  assert.ok(catalog[id].layers.lids.closed);assert.ok(catalog[id].layers.mouth.talk1);assert.ok(catalog[id].layers.mouth.talk2);
  for(const variants of Object.values(catalog[id].layers))for(const name of Object.values(variants)){
   const xml=fs.readFileSync(path.join(__dirname,'../themes/default/assets/wardrobe',id,name),'utf8');assert.match(xml,/viewBox="0 0 220 260"/);assert.doesNotMatch(xml.replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g,''),/NaN|undefined/);
  }
 }
 const xml=fs.readFileSync(path.join(__dirname,'../themes/default/assets/wardrobe/winter-kar-tanesi-kazagi/body.svg'),'utf8');
 assert.match(xml,/M16 173 Q12.2/);assert.doesNotMatch(xml,/nw-sleeve-fix|x="-5"/);
});
test('nightly random outfit persists through midnight, restores selection at 06:00',()=>{
 const s={birthday:'',wardrobeOutfit:w.ITEMS[0].id},save=p=>Object.assign(s,p);
 assert.equal(w.choose(s,new Date(2026,8,28,20,59),save).outfit,w.ITEMS[0].id);
 assert.equal(w.choose(s,new Date(2026,8,28,21),save,()=>.75).outfit,'sleep-6');
 assert.equal(w.choose(s,new Date(2026,8,29,5,59),save,()=>0).outfit,'sleep-6');
 assert.equal(w.choose(s,new Date(2026,8,29,6),save).outfit,w.ITEMS[0].id);
 assert.equal(w.choose(s,new Date(2026,8,29,21),save,()=>0).outfit,'sleep-0');
 assert.equal(w.choose({...s,wardrobeOutfit:null},new Date(2026,8,29,12),save).outfit,null);
});
test('special days override sleepwear; birthday has priority; saved choice survives',()=>{
 const s={birthday:'05-20',wardrobeOutfit:w.ITEMS[1].id};
 assert.equal(w.choose(s,new Date(2026,4,20,23),()=>{}).outfit,'special-birthday');
 assert.equal(w.choose(s,new Date(2026,4,21,12),()=>{}).outfit,w.ITEMS[1].id);
 for(const [day,id] of Object.entries(w.SPECIAL)){
  const [m,d]=day.split('-').map(Number);assert.equal(w.choose({birthday:''},new Date(2026,m-1,d,23),()=>{}).outfit,`special-${id}`);
 }
});
function harness(){
 const pending=[],base={body:{default:{original:true}},eyes:{default:{}},pupils:{default:{}},lids:{closed:{}},brows:{normal:{}},mouth:{neutral:{}}};
 const slots=Object.fromEntries(Object.keys(base).map(k=>[k,{children:Object.values(base[k]),replaceChildren(...a){this.children=a;}}]));const changes=[];
 const r=new Renderer({catalog,scale:1.5,base,slots,changed:(bundle,id)=>changes.push({bundle,id}),makeImage:()=>{
  const img={style:{},dataset:{}};Object.defineProperty(img,'src',{set(url){this.url=url;pending.push(this);}});return img;
 }});return {r,pending,base,slots,changes};
}
test('all layers finish before switching, removal restores exact original character',async()=>{
 const h=harness();h.r.select('winter-kar-tanesi-kazagi');assert.equal(h.changes.length,0);
 const images=h.pending.splice(0);images.slice(1).forEach(i=>i.onload());await tick();assert.equal(h.changes.length,0);
 images[0].onload();await tick();assert.equal(h.r.active,'winter-kar-tanesi-kazagi');assert.equal(h.slots.body.children[0].style.width,'330px');
 h.r.select(null);assert.equal(h.r.active,null);assert.equal(h.slots.body.children[0],h.base.body.default);
});
test('rapid changes, removal and theme disposal never install an obsolete outfit',async()=>{
 const h=harness();h.r.select('daily-kot-ceket');const a=h.pending.splice(0);h.r.select('winter-kar-tanesi-kazagi');const b=h.pending.splice(0);
 b.forEach(i=>i.onload());await tick();a.forEach(i=>i.onload());await tick();assert.equal(h.r.active,'winter-kar-tanesi-kazagi');
 h.r.select('sleep-0');const c=h.pending.splice(0);h.r.select(null);c.forEach(i=>i.onload());await tick();assert.equal(h.r.active,null);
 h.r.select('sleep-1');h.r.dispose();h.pending.forEach(i=>i.onload());await tick();assert.equal(h.r.active,null);
});
test('all 88 choices load without accumulating old layers',async()=>{
 const h=harness();for(const id of Object.keys(catalog)){
  h.r.select(id);h.pending.splice(0).forEach(i=>i.onload());await tick();assert.equal(h.r.active,id);
  for(const [layer,variants]of Object.entries(catalog[id].layers))assert.equal(h.slots[layer].children.length,Object.keys(variants).length);
 }h.r.select(null);assert.equal(h.slots.body.children[0],h.base.body.default);
});
test('asset failure falls back to original animated layers',async()=>{
 const h=harness();h.r.select('sleep-0');const images=h.pending.splice(0),log=console.error;console.error=()=>{};
 try{images[0].onerror();images.slice(1).forEach(i=>i.onload());await tick();}finally{console.error=log;}
 assert.equal(h.r.active,null);assert.equal(h.slots.body.children[0],h.base.body.default);
});
