const test = require('node:test');
const assert = require('node:assert/strict');
const { BeeGame } = require('../src/main/bee');
class MemoryStore { constructor(value = null) {this.value=value;} get(){return this.value;} set(v){this.value=JSON.parse(JSON.stringify(v));} flush(){} }
function game(){const g=new BeeGame(new MemoryStore());g.state.village.arrived=Array.from({length:78},(_,i)=>i+1);return g;}
test('6.6.3 fractional stock cannot consume a honey reservation',()=>{
 const g=game();g.state.storage={yonca:10.96};g.state.orders.list=[{id:'keep',status:'accepted',flower:'yonca',kg:10}];g.state.commercialInputs.plainTart=1;
 assert.equal(g.enqueueWorkshop('honeyTart').ok,false);assert.equal(g.state.storage.yonca,10.96);
 g.state.storage.yonca=11;assert.equal(g.enqueueWorkshop('honeyTart').ok,true);assert.equal(g.state.storage.yonca,10);
});
test('6.6.3 fractional honey cannot be created through production',()=>{const g=game();g.state.storage={yonca:1.96};g.state.commercialInputs.smallGiftBox=1;assert.equal(g.enqueueWorkshop('honeyGiftBox').ok,false);assert.equal(g.state.storage.yonca,1.96);});
test('6.6.3 expensive honey product keeps its value across production and reload',()=>{
 const g=game();g.state.storage={kestane:2};g.state.commercialInputs.smallGiftBox=1;
 const cost=2*g.price('kestane')+g.marketInputPrice('smallGiftBox');
 assert.equal(g.enqueueWorkshop('honeyGiftBox').ok,true);const job=g.state.workshop.active[0];assert.ok(job.unitValue>cost);
 g.processWorkshop(job.remainingMs);assert.equal(g.workshopProductValue('honeyGiftBox'),job.unitValue);
 const restored=new BeeGame(new MemoryStore(JSON.parse(JSON.stringify(g.state))));assert.equal(restored.workshopProductValue('honeyGiftBox'),job.unitValue);
 const before=restored.state.coins;assert.equal(restored.sellWorkshopProduct('honeyGiftBox','all').ok,true);assert.ok(restored.state.coins-before>cost);
 assert.equal(restored.state.workshop.goodsValue.honeyGiftBox,undefined);
});
test('6.6.3 mixed product batches preserve their weighted valuation',()=>{
 const g=game();const jobs=[];
 for(const f of ['kestane','yonca']){g.state.storage={[f]:2};g.state.commercialInputs.smallGiftBox=1;g.enqueueWorkshop('honeyGiftBox');const j=g.state.workshop.active[0];jobs.push(j.unitValue);g.processWorkshop(j.remainingMs);}
 assert.equal(g.workshopProductValue('honeyGiftBox'),Math.ceil((jobs[0]+jobs[1])/2));
 g.removeWorkshopProduct('honeyGiftBox',1);assert.equal(g.workshopProductValue('honeyGiftBox'),Math.ceil((jobs[0]+jobs[1])/2));
});
test('6.6.3 fractional recipe durations complete at the advertised time',()=>{
 const g=game();g.state.storage={yonca:2};g.state.commercialInputs.smallGiftBox=1;g.enqueueWorkshop('honeyGiftBox');
 const day=g.workshopRecipe('premiumJar','yonca').durationMs;assert.equal(g.state.workshop.active[0].totalMs,day*.6);
 g.processWorkshop(day*.6-1);assert.equal(g.workshopProductCount('honeyGiftBox'),0);g.processWorkshop(1);assert.equal(g.workshopProductCount('honeyGiftBox'),1);
});
test('6.6.3 royal jelly orders require stock or an actual producer',()=>{
 const g=game();for(const h of Object.values(g.state.hives)){h.queens=0;h.bees=1;}
 g.state.materials.royalJelly=0;assert.equal(g.commercialOrderCandidates().some(x=>x.id==='royalJellyCareCream'),false);
 g.state.materials.royalJelly=20;assert.equal(g.commercialOrderCandidates().some(x=>x.id==='royalJellyCareCream'),true);
 assert.equal(g.canSupplyCommercialRecipe(g.workshopRecipe('royalJellyCareCream'),2),false);
 g.state.materials.royalJelly=0;g.state.workshop.products.goods.royalJellyCareCream=1;
 assert.equal(g.commercialOrderCandidates().some(x=>x.id==='royalJellyCareCream'),true);
});
test('6.6.3 estimates use real time, background speed cap, pause and reservations',()=>{
 const g=game();g.state.storage={yonca:10};for(const h of Object.values(g.state.hives))h.honey={};
 g.state.orders.list=[{id:'first',status:'accepted',flower:'yonca',kg:10}];const o={id:'second',flower:'yonca',kg:10,days:2};
 g.state.speed=1;const one=g.honeyOrderEstimate(o,{yonca:1});assert.ok(one.estimateMs>0);
 g.state.speed=4;assert.equal(g.honeyOrderEstimate(o,{yonca:1}).estimateMs,one.estimateMs/4);
 g.lastSpeedCap=2;assert.equal(g.honeyOrderEstimate(o,{yonca:1}).estimateMs,one.estimateMs/2);
 g.state.speed=0;assert.equal(g.honeyOrderEstimate(o,{yonca:1}).estimatePaused,true);assert.equal(g.honeyOrderEstimate(o,{yonca:1}).estimateRisk,true);
 assert.equal(g.honeyOrderEstimate({...o,id:'first'},{yonca:1}).estimateMs,0);
});
test('6.6.3 legacy queued jobs retain the honey type in their valuation',()=>{
 const g=game();g.state.storage={kestane:2};g.state.commercialInputs.smallGiftBox=1;
 const cost=2*g.price('kestane')+g.marketInputPrice('smallGiftBox');
 g.enqueueWorkshop('honeyGiftBox');delete g.state.workshop.active[0].unitValue;
 const restored=new BeeGame(new MemoryStore(JSON.parse(JSON.stringify(g.state))));
 restored.processWorkshop(restored.state.workshop.active[0].remainingMs);
 assert.ok(restored.workshopProductValue('honeyGiftBox')>cost);
});
