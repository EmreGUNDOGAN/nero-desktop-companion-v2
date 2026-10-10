import {menuCatalog} from './menu-catalog.js';
import {MenuUnlocks} from './unlock-rules.js';
import {MaterialStock} from './material-stock.js';
import {ResearchQueue} from './research-queue.js';
import {ProductionScheduler} from './production-scheduler.js';
import {ActivityClock} from './activity-clock.js';
import {materials,exampleRecipes,storageOffer} from './supply-policy.js';
const $=id=>document.getElementById(id);
let balance=50000,prepared=0,demand=0;
const reference=menuCatalog.byId.get('food-1').saleGold,spend=(cost)=>{if(balance<cost)return false;balance-=cost;return true;};
// Explicit sandbox policy: 20% ingredient-budget, 20 sales per upgrade. Not final economy.
const stock=new MaterialStock({materials,recipes:{'food-1':{meat:1,bread:1},'food-96':{cola:1}},capacity:1000,unlocked:[],spend});for(const id of ['meat','bread','cola'])stock.unlockMaterial(id);
const inputs=new Map();for(const m of materials){const row=document.createElement('tr');const name=document.createElement('td');name.textContent=m.name;const amount=document.createElement('td'),input=document.createElement('input');input.type='number';input.min=0;input.max=10000;input.step=1;input.value=['meat','bread','cola'].includes(m.id)?100:0;input.setAttribute('aria-label',m.name+' sipariş adedi');amount.append(input);const price=document.createElement('td');price.textContent=m.unitGold===null?'Bedel kararı bekliyor':m.unitGold+' altın / adet (taslak)';row.append(name,amount,price);$('order-items').append(row);inputs.set(m.id,input);}for(const recipe of exampleRecipes){const row=document.createElement('tr');for(const value of [recipe.name,Object.entries(recipe.items).map(([id,n])=>n+' '+materials.find(m=>m.id===id).name).join(' + ')]){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}$('recipe-proposal').append(row);}

const unlocks=new MenuUnlocks(menuCatalog,{read:()=>({level:2,gold:balance}),spend});
const research=new ResearchQueue({policies:{'food-2':{seconds:300}},authorize:id=>unlocks.beginResearch(id),complete:id=>unlocks.completeResearch(id),spendSecondSlot:()=>spend(reference*20)});
const scheduler=new ProductionScheduler(menuCatalog,{isUnlocked:id=>unlocks.has(id),hasCapacity:()=>prepared<3,hasReadyCapacity:()=>prepared<3,demand:()=>demand,available:()=>prepared,reserveMaterials:id=>stock.reserve(id),releaseMaterials:token=>stock.release(token),consumeMaterials:token=>stock.consume(token),onReady:()=>prepared++});scheduler.configure('burger',{automatic:true,speedLevel:0});
const clock=new ActivityClock(performance.now());
function advance(seconds){research.update(seconds);for(let left=seconds;left>1e-8;){const dt=Math.min(.05,left);left-=dt;stock.update(dt);scheduler.update(dt);}}
function refresh(){const s=stock.snapshot(),r=research.snapshot(),jobs=scheduler.snapshot().jobs;$('balance').textContent=balance.toLocaleString('tr-TR')+' deneme altını';$('capacity').textContent=`Dolap: ${s.used}/${s.capacity} · Yolda ayrılan yer: ${s.incoming} · Boş: ${s.free}`;$('materials').replaceChildren(...s.materials.map(m=>{const row=document.createElement('tr');for(const v of [m.name+(m.unlocked?'':' · Henüz açılmadı'),m.stock,m.reserved,m.incoming]){const cell=document.createElement('td');cell.textContent=v;row.append(cell);}return row;}));for(const m of s.materials)inputs.get(m.id).disabled=!m.unlocked||m.unitGold===null;$('unlock-potato').disabled=s.materials.find(m=>m.id==='potato').openingGrantReceived;$('bonus-pending').textContent=s.bonusPending.length?'Yer bekleyen başlangıç stoğu: '+s.bonusPending.map(b=>b.quantity+' '+materials.find(m=>m.id===b.id).name).join(', '):'';$('deliveries').textContent=s.deliveries.map(d=>`Teslimat #${d.id}: ${Math.ceil(d.remaining)} sn`).join(' · ')||'Yolda sipariş yok';$('production').textContent=`Hazır burger: ${prepared}/3 · `+(jobs.length?`Hazırlanıyor: ${Math.ceil(jobs[0].remaining)} sn`:'Üretim bekliyor');$('produce').disabled=prepared>=3||jobs.length>0||Object.keys(stock.missing('food-1')).length>0;$('research-state').textContent=`Araştırma yeri: ${r.slots} · `+(r.jobs.length?r.jobs.map(j=>`${menuCatalog.byId.get(j.id).name}: ${Math.ceil(j.remaining)} sn`).join(', '):unlocks.has('food-2')?'Tarif açıldı':'Aktif araştırma yok');$('research').disabled=unlocks.has('food-2')||r.jobs.length>=r.slots;$('research').textContent=`İkinci burger tarifini araştır · ${menuCatalog.byId.get('food-2').unlockGold} altın`;$('slot').disabled=r.slots===2||balance<reference*20;$('slot').textContent=`İkinci araştırma yeri · ${reference*20} altın`;const offer=storageOffer(s.capacity);$('storage').disabled=!offer||balance<offer.cost;$('storage').textContent=offer?'Depo: '+offer.next.toLocaleString('tr-TR')+' birim · '+offer.cost.toLocaleString('tr-TR')+' altın (taslak)':'Depo en yüksek kapasitede';$('automatic').disabled=Boolean(s.automatic)||balance<reference*20;$('automatic').textContent=s.automatic?'Otomatik tedarik açık':`Otomatik tedarik · ${reference*20} altın`;$('pause').textContent=clock.manualPaused?'Devam et':'Duraklat';}
const feedback=text=>{$('feedback').textContent=text;refresh();};
$('order').onclick=()=>{const items=Object.fromEntries([...inputs].map(([id,input])=>[id,Number(input.value)]).filter(([,n])=>n!==0));const result=stock.order(items,20);feedback(result.allowed?'Sipariş ödendi; teslimat yolda.':result.reason==='capacity'?'Dolapta yeterli yer yok.':'Deneme altını yetersiz.');};
$('storage').onclick=()=>{const offer=storageOffer(stock.capacity);if(offer)stock.increaseCapacity(offer.next,offer.cost);refresh();};
$('automatic').onclick=()=>{if(!stock.automatic&&spend(reference*20))stock.configureAutomatic({threshold:25,target:100,seconds:20});refresh();};
$('unlock-potato').onclick=()=>{stock.unlockMaterial('potato');refresh();};
$('produce').onclick=()=>{demand=prepared+1;scheduler.update(.001);refresh();};
$('cancel-production').onclick=()=>{demand=0;scheduler.update(.001);refresh();};
$('research').onclick=()=>{const result=research.start('food-2');feedback(result.allowed?'Araştırma başladı.':'Araştırma başlatılamadı: '+result.reason);};
$('slot').onclick=()=>{research.buySecondSlot();refresh();};
$('pause').onclick=()=>{advance(clock.setPaused(!clock.manualPaused,performance.now()));refresh();};
$('reset').onclick=()=>location.reload();
document.addEventListener('visibilitychange',()=>{advance(clock.setHidden(document.hidden,performance.now()));refresh();});
setInterval(()=>{advance(clock.advance(performance.now()));refresh();},100);
window.__neroSupplyResearch={snapshot:()=>({balance,stock:stock.snapshot(),research:research.snapshot(),unlocks:unlocks.snapshot(),clock:clock.snapshot(),production:scheduler.snapshot(),prepared})};refresh();
