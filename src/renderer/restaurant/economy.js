import {STATION_LEVELS} from './progression.js';
// Reviewable first economy proposal. Prices share the same sales-based scale.
export const ECONOMY={referenceCheck:6,waiterCost:240,cashierCosts:[480,0,960],automaticSales:20,speedSales:15};
export const MENU={burger:{name:'Yengeç Burger',category:'main',station:'burger',baseSeconds:10,price:25,xp:10,unlockLevel:1,unlockGold:0,modelId:'food-1'},drink:{name:'Kola',category:'drink',station:'soda',baseSeconds:6,price:10,xp:4,unlockLevel:1,unlockGold:0,modelId:'food-96'},fries:{name:'Yengeç Patates',category:'side',station:'fryer',baseSeconds:8,price:15,xp:6,unlockLevel:STATION_LEVELS.fryer,unlockGold:320,modelId:'food-32'},pizza:{name:'Yengeç Pizza',category:'main',station:'oven',baseSeconds:15,price:40,xp:15,unlockLevel:STATION_LEVELS.oven,unlockGold:960,modelId:'food-44'}};
export const productionSeconds=(base,level)=>base*(1-.1*Math.min(5,Math.max(0,level)));
export const speedCost=(kind,level)=>MENU[kind].price*ECONOMY.speedSales*(level+1)**2;
export const XP_TARGETS=[0,0,60,100,180,280,400,550,700,850,1000];
export const nextLevelXP=level=>XP_TARGETS[level+1]??Math.round((1000+160*(level-9)+24*(level-9)**2)/10)*10;
