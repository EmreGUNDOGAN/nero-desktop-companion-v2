import {menuCatalog} from './menu-catalog.js';
const burgerSale=menuCatalog.byId.get('food-1').saleGold;
export const STORAGE_TIERS=[1000,2000,5000,10000];
// Draft: each extra storage unit costs half of the reference burger sale.
export function storageOffer(capacity){const index=STORAGE_TIERS.indexOf(capacity),next=STORAGE_TIERS[index+1];return next?{next,cost:(next-capacity)*burgerSale/2,balanceStatus:'draft'}:null;}
export const materials=[
 {id:'meat',name:'Et',unitGold:burgerSale*.16},
 {id:'bread',name:'Ekmek',unitGold:burgerSale*.04},
 {id:'cola',name:'Kola',unitGold:menuCatalog.byId.get('food-96').saleGold*.20},
 {id:'potato',name:'Patates',unitGold:menuCatalog.byId.get('food-32').saleGold*.20},
 ...[['cheese','Peynir'],['vegetables','Sebze'],['sauce','Sos'],['dough','Hamur'],['sausage','Sosis'],['milk','Süt'],['fruit','Meyve'],['coffee','Kahve'],['tea','Çay'],['sugar','Şeker'],['pasta','Makarna']].map(([id,name])=>({id,name,unitGold:null}))
];
export const exampleRecipes=[
 {name:'Yengeç Burger',items:{meat:1,bread:1}},
 {name:'Peynirli Burger',items:{meat:1,bread:1,cheese:1}},
 {name:'Üç katlı Burger',items:{meat:3,bread:1}},
 {name:'Patates kızartması',items:{potato:1}},
 {name:'Kola',items:{cola:1}},
 {name:'Pizza',items:{dough:1,cheese:1,sauce:1}},
 {name:'Hot dog',items:{sausage:1,bread:1}},
 {name:'Salata',items:{vegetables:2}},
 {name:'Milkshake',items:{milk:1,fruit:1}},
 {name:'Meyve suyu',items:{fruit:2}},
 {name:'Kahve',items:{coffee:1}},
 {name:'Çay',items:{tea:1}},
 {name:'Dondurma',items:{milk:1,sugar:1}},
 {name:'Tatlı',items:{dough:1,milk:1,sugar:1}},
 {name:'Çorba',items:{vegetables:1}},
 {name:'Makarna',items:{pasta:1,sauce:1}}
];
