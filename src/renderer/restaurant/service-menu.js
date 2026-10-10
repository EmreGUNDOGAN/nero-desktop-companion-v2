import {menuCatalog,liveEconomy} from './live-menu-catalog.js';
import {MENU as starters,ECONOMY} from './economy.js';

// Stable legacy keys keep existing controls and saves compatible.
const aliases=new Map(Object.entries(starters).map(([key,value])=>[value.modelId,key]));
export const drinkStations=new Set(['soda','shake','juice','hot-drink']);
const mainExtras=new Set(['food-44','food-125','food-126','food-139','food-148']);
export function category(recipe){
 if(drinkStations.has(recipe.station))return 'drink';
 if(['burger','hotdog','soup-pasta-extra'].includes(recipe.station)||mainExtras.has(recipe.id))return 'main';
 if(['icecream','dessert'].includes(recipe.station)||['food-145','food-160','food-136'].includes(recipe.id))return 'dessert';
 return 'side';
}
export const MENU=Object.fromEntries([...menuCatalog.byId.values()].map(p=>{
 const key=aliases.get(p.id)||p.id;
 return [key,{name:starters[key]?.name||p.name,category:category(p),station:p.station,baseSeconds:p.seconds,price:p.saleGold,xp:p.saleXP,unlockLevel:p.level,unlockGold:p.unlockGold,modelId:p.id,decisionPending:p.stationDecisionPending}];
}));
export const stationSources={'soda':{x:2.55,z:-5.95},'shake':{x:-3.46,z:-5.95},'juice':{x:.12,z:-5.95},'hot-drink':{x:-7.05,z:-5.95}};
export const sourceFor=kind=>stationSources[MENU[kind].station]||{x:4.45,z:-5.95};
export const poolFor=kind=>drinkStations.has(MENU[kind].station)?MENU[kind].station:'food';
export const stationRepresentatives=Object.fromEntries([...new Set(Object.values(MENU).filter(m=>!m.decisionPending).map(m=>m.station))].map(station=>[station,Object.keys(MENU).find(k=>MENU[k].station===station)]));
// Physical machine opening cost is the shared base for every recipe on that machine.
const machinePrices=new Map(liveEconomy.machines.map(m=>[m.station,m.machine_gold]));
const roundGold=value=>Math.round(value*100)/100;
export const stationUpgradeBase=station=>machinePrices.get(station)??MENU[stationRepresentatives[station]].price*ECONOMY.automaticSales*4;
// Free starter machines retain their previous automation charge as the reference price.
export const stationAutomaticCost=station=>roundGold(stationUpgradeBase(station)*.25);
export const stationSpeedCost=(station,level)=>roundGold(stationAutomaticCost(station)*2**level);
export function chooseOrder(isUnlocked,random){
 const available=Object.keys(MENU).filter(k=>!MENU[k].decisionPending&&isUnlocked(k));
 const pool=type=>available.filter(k=>MENU[k].category===type),pick=items=>items[Math.floor(random()*items.length)];
 const mains=pool('main');if(!mains.length)return [];
 const items=[pick(mains)],second=mains.filter(k=>k!==items[0]);
 if(second.length&&random()<.04)items.push(pick(second));
 const drinks=pool('drink');if(drinks.length&&random()<.65)items.push(pick(drinks));
 const extras=[...pool('side'),...pool('dessert')];if(extras.length&&random()<.40)items.push(pick(extras));
 return items;
}
