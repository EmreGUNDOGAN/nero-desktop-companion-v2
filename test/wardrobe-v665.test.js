'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const w=require('../src/main/wardrobe'),added=require('../src/main/wardrobe-additions.json'),catalog=require('../themes/default/assets/wardrobe/catalog.json');
const baseline=require('../scripts/wardrobe-v665/original-hashes.json');
test('all original illustrated assets are preserved byte-for-byte',()=>{
 for(const [file,hash]of Object.entries(baseline)){
  if(file.endsWith('catalog.json'))continue;
  const p=path.resolve(__dirname,'..',file);
  const data = fs.readFileSync(p);
  const digest = crypto.createHash('sha256').update(data).digest('hex');
  // Git checks out JSON with LF on Linux; the preserved Windows baseline uses CRLF.
  const windowsDigest = file.endsWith('profiles.json') ? crypto.createHash('sha256').update(data.toString('utf8').replace(/\r?\n/g, '\r\n')).digest('hex') : digest;
  assert.ok(digest === hash || windowsDigest === hash, file);
 }
});
test('new choices have distinct IDs and complete independent animated layers',()=>{
 assert.equal(w.LEGACY_ITEMS.length,72);assert.equal(new Set(w.ITEMS.map(x=>x.id)).size,w.ITEMS.length);
 const names=new Set(w.LEGACY_ITEMS.map(x=>x.name.toLocaleLowerCase('tr')));
 for(const d of added){assert.ok(!names.has(d.name.toLocaleLowerCase('tr')));const c=catalog[d.id];assert.ok(c.layers.lids.closed);assert.ok(c.layers.mouth.talk1);assert.ok(c.layers.mouth.talk2);
 for(const variants of Object.values(c.layers))for(const file of Object.values(variants))assert.ok(fs.existsSync(path.join(__dirname,'../themes/default/assets/wardrobe',d.id,file)));
 assert.ok(fs.existsSync(path.join(__dirname,'../themes/default/assets/wardrobe',`outfit-${d.id}.png`)));
 }
});
test('new wardrobe choice survives night and special-day overrides',()=>{
 if(!added.length)return;const s={birthday:'',wardrobeOutfit:added[0].id},save=p=>Object.assign(s,p);
 assert.equal(w.choose(s,new Date(2026,8,28,12),save).outfit,added[0].id);
 assert.match(w.choose(s,new Date(2026,8,28,23),save,()=>0).outfit,/^sleep-/);
 assert.equal(w.choose(s,new Date(2026,8,29,12),save).outfit,added[0].id);
 assert.equal(w.choose(s,new Date(2026,9,31,12),save).outfit,'special-halloween');
 assert.equal(s.wardrobeOutfit,added[0].id);
});
const player=require('../src/renderer/character/motion-player');
for(const name of ['laugh','think','peek','balance','victory','tap','cross','glance','pet','shy','yawn','nod','dance'])test(name+' resets all effects on cancellation',()=>{
 const timers=new Map(),clips=[];let next=0,pose,gaze,active;
 const p=player({node:()=>({animate(){const clip={cancelled:false,cancel(){this.cancelled=true;}};clips.push(clip);return clip;}}),onPose:v=>pose=v,onGaze:v=>gaze=v,onActive:v=>active=v,setTimeoutFn:(f,t)=>{timers.set(++next,f);return next;},clearTimeoutFn:id=>timers.delete(id)});
 assert.equal(p.play(name),true);assert.equal(active,true);p.reset();assert.equal(active,false);assert.equal(pose,null);assert.equal(gaze,null);assert.equal(timers.size,0);assert.ok(clips.every(c=>c.cancelled));
});
