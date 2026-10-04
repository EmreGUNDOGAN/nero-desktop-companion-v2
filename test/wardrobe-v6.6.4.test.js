const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const catalog=require('../src/shared/wardrobe-catalog'),createPlayer=require('../src/renderer/character/motion-player'),rules=require('../src/main/motion-rules');
test('100 named outfits in five independent groups, with assets and articulated sleeves',()=>{
 assert.equal(catalog.items.length,100);assert.equal(new Set(catalog.items.map(x=>x.id)).size,100);assert.equal(new Set(catalog.items.map(x=>x.name)).size,100);
 for(const c of catalog.categories)assert.equal(catalog.items.filter(i=>i.category===c.id).length,20);
 for(const i of catalog.items){assert.ok(i.body&&i.left&&i.right);assert.ok(fs.existsSync(path.join(__dirname,'../src/renderer/character/wardrobe',i.id+'.svg')));assert.doesNotMatch(i.body+i.left+i.right,/<image|<script|onload=/);}
});
test('approved retro fit stays byte-for-byte unchanged',()=>{
 const approved=require('../scripts/wardrobe/approved-retro.json'),actual=catalog.items[0];for(const k of ['body','hat','left','right'])assert.equal(actual[k],approved[k]);
});
for(const name of rules.NAMES)test(`motion ${name} cancels and resets without stale pose`,()=>{
 let active=false,pose=null,cancelled=0;const timers=new Map();let next=0;const nodes=new Set();
 const player=createPlayer({node:id=>{nodes.add(id);return{animate:()=>({cancel:()=>cancelled++})}},onPose:p=>pose=p,onGaze:()=>{},onActive:v=>active=v,setTimeoutFn:(fn,ms)=>{timers.set(++next,{fn,ms});return next;},clearTimeoutFn:id=>timers.delete(id)});
 assert.equal(player.play(name),true);assert.equal(active,true);assert.ok(pose);assert.ok(nodes.size>0);
 player.reset();assert.equal(active,false);assert.equal(pose,null);assert.equal(timers.size,0);assert.ok(cancelled>0);
 assert.equal(player.play('invalid'),false);
});
test('motion gates respect sleep, hidden state, disabled motion, custom themes and pet anger',()=>{
 const base={name:'dance',now:100000,lastMotionAt:0};assert.equal(rules.canPlay(base),true);
 for(const flag of ['hidden','asleep','dragging'])assert.equal(rules.canPlay({...base,[flag]:true,manual:true}),false);
 for(const flag of ['enabled','compatible'])assert.equal(rules.canPlay({...base,[flag]:false,manual:true}),false);
 assert.equal(rules.canPlay({...base,name:'pet',petAngryUntil:100001,manual:true}),false);assert.equal(rules.canPlay({...base,lastMotionAt:99999}),false);assert.equal(rules.canPlay({...base,lastMotionAt:99999,manual:true}),true);
});
test('outfit selection, removal, invalid persisted key and birthday priority',()=>{
 const src=fs.readFileSync(path.join(__dirname,'../src/main/main.js'),'utf8');const code=src.slice(src.indexOf('function currentOutfit('),src.indexOf('function updateBaseline('));let selected='retro-01';const ctx={wardrobe:catalog,settings:()=>({wardrobeOutfit:selected}),currentTheme:{manifest:{rigCompatible:true}},isBirthday:()=>false};vm.createContext(ctx);vm.runInContext(code,ctx);
 assert.equal(ctx.currentOutfit(new Date(2026,9,4,12)),'retro-01');selected='none';assert.equal(ctx.currentOutfit(new Date(2026,9,4,12)),null);selected='invalid';assert.equal(ctx.currentOutfit(new Date(2026,9,4,23)),'pajama');ctx.isBirthday=()=>true;selected='retro-01';assert.equal(ctx.currentOutfit(new Date(2026,9,4,23)),'party');
});
test('every animation target exists in the real rig; original body outline preserved',()=>{
 const template=require('../src/shared/nero-rig-template'),source=fs.readFileSync(path.join(__dirname,'../src/renderer/character/motion-player.js'),'utf8');
 for(const [,id] of source.matchAll(/anim\('([^']+)'/g))assert.ok(template.includes(`data-rig="${id}"`),id);
 const body=fs.readFileSync(path.join(__dirname,'../themes/default/assets/body.svg'),'utf8');
 const outline='M110 22 C170 22 188 70 188 130 C188 200 170 238 110 238 C50 238 32 200 32 130 C32 70 50 22 110 22 Z';assert.ok(template.includes(outline));assert.ok(body.includes(outline));
});
test('all motion timers complete and release animation state',()=>{
 for(const name of rules.NAMES){let active=false,pose,t=0;const timers=new Map();const player=createPlayer({node:()=>({animate:()=>({cancel(){}})}),onPose:p=>pose=p,onGaze:()=>{},onActive:a=>active=a,setTimeoutFn:(fn,ms)=>{timers.set(++t,{fn,ms});return t;},clearTimeoutFn:id=>timers.delete(id)});player.play(name);for(const [id,item] of [...timers].sort((a,b)=>a[1].ms-b[1].ms)){if(timers.has(id)){timers.delete(id);item.fn();}}assert.equal(active,false,name);assert.equal(pose,null,name);assert.equal(timers.size,0,name);}
});
test('built-in compatible themes retain valid assets',()=>{
 const {ThemeManager}=require('../src/main/themes');const manager=new ThemeManager({builtinDir:path.join(__dirname,'../themes'),userDir:path.join(__dirname,'missing-user-themes')});manager.scan();const entries=[...manager.themes.values()].filter(t=>t.manifest.rigCompatible);assert.ok(entries.length>0);for(const entry of entries)assert.deepEqual(entry.errors,[],entry.id);
});
test('settings IPC logic persists an outfit across reload and rejects unknown IDs',()=>{
 const os=require('node:os'),{JsonStore}=require('../src/main/store');const dir=fs.mkdtempSync(path.join(os.tmpdir(),'nero-wardrobe-'));const defaults={wardrobeOutfit:'auto',characterAnimations:true};const store=new JsonStore(dir,'settings',defaults);let updates=0;
 try{const src=fs.readFileSync(path.join(__dirname,'../src/main/main.js'),'utf8');const code=src.slice(src.indexOf('function setSetting('),src.indexOf('// İş bazlı kronometre'));const ctx={DEFAULT_SETTINGS:defaults,settings:()=>store.get(),settingsStore:store,wardrobe:catalog,updateBaseline:()=>updates++,stats:null,broadcastState:()=>{}};vm.createContext(ctx);vm.runInContext(code,ctx);ctx.setSetting('wardrobeOutfit','space-20');store.flush();assert.equal(new JsonStore(dir,'settings',defaults).get().wardrobeOutfit,'space-20');assert.equal(updates,1);ctx.setSetting('wardrobeOutfit','not-a-costume');assert.equal(store.get().wardrobeOutfit,'space-20');ctx.setSetting('wardrobeOutfit','none');assert.equal(store.get().wardrobeOutfit,'none');ctx.setSetting('characterAnimations',false);assert.equal(store.get().characterAnimations,false);}finally{store.flush();fs.rmSync(dir,{recursive:true,force:true});}
});
