// 6.6.1 — Fiziksel Pazar yarı mamulleri ve Atölye ticari ürün kataloğu.
// Fiyatlar tek tek keyfi sabitlenmez: yarı mamul fiyatı açılış seviyesi + kalite derecesinden türetilir;
// bitmiş ürün değeri bee.js içinde gerçek girdilerin ekonomik değeri + süre + hedef marj ile hesaplanır.

const SHOPS = [
  { id:'bakkal', unlock:6, name:'Bakkal', owner:'Bakkal Hüseyin', inputs:[
    ['smallGiftBox','Küçük Hediye Kutusu','🎁',1], ['packingSet','Kavanoz / Paketleme Seti','🫙',1], ['giftBasket','Hediye Sepeti','🧺',2]
  ]},
  { id:'cicekci', unlock:7, name:'Çiçekçi Ezgi', owner:'Ezgi', inputs:[
    ['driedLavender','Kurutulmuş Lavanta','💜',1], ['thymeBundle','Kekik Demeti','🌿',1], ['flowerMix','Çiçek Karışımı','🌸',2]
  ]},
  { id:'atolye', unlock:9, name:'Arıcılık Atölyesi', owner:'Mumcu', inputs:[
    ['candleKit','Mum Kabı + Fitil','🕯️',1], ['candleGiftBox','Mum Hediye Kutusu','🎁',2], ['scentedCandleBase','Kokulu Mum Bazı','🌺',2]
  ]},
  { id:'pastane', unlock:12, name:'Pastane', owner:'Pastacı Nur', inputs:[
    ['plainTart','Sade Turta','🥧',1], ['cakeBase','Kek Tabanı','🍰',2], ['dessertBase','Tatlı Tabanı','🍮',2]
  ]},
  { id:'baldukkan', unlock:14, name:'Bal Dükkânı', owner:'Bal Dükkânı', inputs:[
    ['tastingBox','Tadım Kutusu','🧰',1], ['premiumHoneyBox','Premium Bal Kutusu','🎁',2], ['specialJar','Özel Kavanoz','🫙',3]
  ]},
  { id:'kahveci', unlock:19, name:'Kahveci', owner:'Kahveci', inputs:[
    ['coffeeBase','Kahve Bazı','☕',1], ['coffeeBottle','Kahve Şişesi','🥤',2], ['coffeeGiftPack','Kahve Hediye Paketi','🎁',3]
  ]},
  { id:'firin', unlock:30, name:'Fırın', owner:'Fırıncı Leyla', inputs:[
    ['plainRoll','Sade Çörek','🥯',1], ['breadBase','Ekmek','🥖',1], ['cookieBase','Kurabiye Bazı','🍪',2]
  ]},
  { id:'dondurma', unlock:37, name:'Dondurmacı', owner:'Dondurmacı', inputs:[
    ['iceCreamBase','Sade Dondurma Bazı','🍦',2], ['iceCreamCup','Dondurma Kabı','🥣',1]
  ]},
  { id:'eczane', unlock:44, name:'Eczane', owner:'Eczane', inputs:[
    ['dropperBottle','Damlalık Şişesi','💧',1], ['lozengeBase','Pastil Bazı','💊',2], ['creamBase','Krem Bazı','🧴',2]
  ]},
  { id:'recelci', unlock:50, name:'Reçelci', owner:'Reçelci', inputs:[
    ['fruitBase','Meyve Bazı','🍓',1], ['jamBase','Reçel Bazı','🍯',2], ['premiumJamJar','Premium Kavanoz','🫙',3]
  ]},
  { id:'marangoz', unlock:57, name:'Marangoz Atölyesi', owner:'Marangoz İsmail', inputs:[
    ['woodGiftBox','Ahşap Hediye Kutusu','🪵',1], ['premiumChest','Premium Sandık','🧰',2], ['woodDisplayCrate','Ahşap Sunum Kasası','📦',3]
  ]},
  { id:'lokumcu', unlock:67, name:'Lokumcu', owner:'Lokumcu', inputs:[
    ['plainLokum','Sade Lokum','🍬',1], ['premiumLokumBase','Premium Lokum Bazı','🍡',2], ['lokumBox','Lokum Kutusu','🎁',3]
  ]}
].map((shop) => ({ ...shop, inputs: shop.inputs.map(([id,name,icon,grade]) => ({id,name,icon,grade,shop:shop.id,unlock:shop.unlock})) }));

const RECIPES = [
  // Bakkal
  {id:'honeyGiftBox',name:'Bal Hediye Kutusu',icon:'🎁',shop:'bakkal',unlock:6,durationDays:0.6,honeyKg:2,inputs:{smallGiftBox:1}},
  {id:'honeyCandlePack',name:'Bal & Mum Paketi',icon:'🎀',shop:'bakkal',unlock:6,durationDays:0.8,honeyKg:1.5,waxKg:.2,inputs:{packingSet:1}},
  {id:'beekeeperGiftBasket',name:'Arıcılık Hediye Sepeti',icon:'🧺',shop:'bakkal',unlock:6,durationDays:1,honeyKg:3,waxKg:.15,inputs:{giftBasket:1}},
  // Çiçekçi
  {id:'lavenderHoney',name:'Lavantalı Bal',icon:'💜',shop:'cicekci',unlock:7,durationDays:.7,honeyKg:2,honeyFlower:'lavanta',inputs:{driedLavender:1}},
  {id:'thymeHoney',name:'Kekikli Bal',icon:'🌿',shop:'cicekci',unlock:7,durationDays:.7,honeyKg:2,honeyFlower:'kekik',inputs:{thymeBundle:1}},
  {id:'lavenderCandle',name:'Lavanta Kokulu Mum',icon:'🕯️',shop:'cicekci',unlock:7,durationDays:.8,waxKg:.35,inputs:{driedLavender:1,candleKit:1}},
  {id:'flowerHoneySet',name:'Çiçekli Bal Seti',icon:'🌸',shop:'cicekci',unlock:7,durationDays:1.1,honeyKg:3,inputs:{flowerMix:1}},
  // Atölye / Mumcu
  {id:'thymeCandle',name:'Kekik Mumu',icon:'🕯️',shop:'atolye',unlock:9,durationDays:.8,waxKg:.35,inputs:{thymeBundle:1,candleKit:1}},
  {id:'propolisBeekeeperCandle',name:'Propolisli Arıcı Mumu',icon:'🕯️',shop:'atolye',unlock:9,durationDays:1,waxKg:.35,materials:{propolis:30},inputs:{scentedCandleBase:1}},
  {id:'tripleCandleSet',name:"3'lü Mum Seti",icon:'🎁',shop:'atolye',unlock:9,durationDays:1.2,waxKg:.75,inputs:{candleGiftBox:1}},
  // Pastane
  {id:'honeyTart',name:'Ballı Turta',icon:'🥧',shop:'pastane',unlock:12,durationDays:.8,honeyKg:1,inputs:{plainTart:1}},
  {id:'lavenderHoneyCake',name:'Lavantalı Ballı Kek',icon:'🍰',shop:'pastane',unlock:12,durationDays:1,honeyKg:1.5,honeyFlower:'lavanta',inputs:{cakeBase:1}},
  {id:'chestnutHoneyCake',name:'Kestane Ballı Kek',icon:'🍰',shop:'pastane',unlock:12,durationDays:1,honeyKg:1.5,honeyFlower:'kestane',inputs:{cakeBase:1}},
  {id:'honeyDessert',name:'Ballı Tatlı',icon:'🍮',shop:'pastane',unlock:12,durationDays:.8,honeyKg:1,inputs:{dessertBase:1}},
  // Bal Dükkânı
  {id:'honeyTastingSet',name:"3'lü Bal Tadım Seti",icon:'🍯',shop:'baldukkan',unlock:14,durationDays:1,honeyKg:3,inputs:{tastingBox:1}},
  {id:'premiumHoneyBoxProduct',name:'Premium Bal Kutusu',icon:'🎁',shop:'baldukkan',unlock:14,durationDays:1.1,honeyKg:3,inputs:{premiumHoneyBox:1}},
  {id:'specialFlowerHoneyCollection',name:'Özel Çiçek Balı Koleksiyonu',icon:'🫙',shop:'baldukkan',unlock:14,durationDays:1.3,honeyKg:4,inputs:{specialJar:1}},
  // Kahveci
  {id:'honeyCoffeeSyrup',name:'Ballı Kahve Şurubu',icon:'☕',shop:'kahveci',unlock:19,durationDays:.7,honeyKg:1,inputs:{coffeeBase:1}},
  {id:'honeyColdCoffee',name:'Ballı Soğuk Kahve Konsantresi',icon:'🥤',shop:'kahveci',unlock:19,durationDays:.9,honeyKg:1,inputs:{coffeeBottle:1}},
  {id:'honeyCoffeeGiftSet',name:'Bal & Kahve Hediye Seti',icon:'🎁',shop:'kahveci',unlock:19,durationDays:1.1,honeyKg:2,inputs:{coffeeGiftPack:1}},
  // Fırın 30
  {id:'honeyRoll',name:'Ballı Çörek',icon:'🥯',shop:'firin',unlock:30,durationDays:.6,honeyKg:1,inputs:{plainRoll:1}},
  {id:'honeyBread',name:'Ballı Ekmek',icon:'🥖',shop:'firin',unlock:30,durationDays:.7,honeyKg:1,inputs:{breadBase:1}},
  {id:'honeyCookie',name:'Ballı Kurabiye',icon:'🍪',shop:'firin',unlock:30,durationDays:.6,honeyKg:.8,inputs:{cookieBase:1}},
  // Dondurmacı
  {id:'honeyIceCream',name:'Ballı Dondurma',icon:'🍦',shop:'dondurma',unlock:37,durationDays:.6,honeyKg:1,inputs:{iceCreamBase:1,iceCreamCup:1}},
  {id:'lavenderHoneyIceCream',name:'Lavantalı Ballı Dondurma',icon:'🍦',shop:'dondurma',unlock:37,durationDays:.7,honeyKg:1,honeyFlower:'lavanta',inputs:{iceCreamBase:1,iceCreamCup:1}},
  {id:'chestnutHoneyIceCream',name:'Kestane Ballı Dondurma',icon:'🍦',shop:'dondurma',unlock:37,durationDays:.7,honeyKg:1,honeyFlower:'kestane',inputs:{iceCreamBase:1,iceCreamCup:1}},
  // Eczane
  {id:'propolisDrops',name:'Propolis Damlası',icon:'💧',shop:'eczane',unlock:44,durationDays:.8,materials:{propolis:50},inputs:{dropperBottle:1}},
  {id:'propolisLozenge',name:'Propolis Pastili',icon:'💊',shop:'eczane',unlock:44,durationDays:.8,honeyKg:.5,materials:{propolis:40},inputs:{lozengeBase:1}},
  {id:'propolisCream',name:'Propolis Kremi',icon:'🧴',shop:'eczane',unlock:44,durationDays:1,materials:{propolis:60},inputs:{creamBase:1}},
  {id:'royalJellyCareCream',name:'Arı Sütlü Bakım Kremi',icon:'🧴',shop:'eczane',unlock:44,durationDays:1.1,materials:{royalJelly:20},inputs:{creamBase:1}},
  // Reçelci
  {id:'honeyFruitJam',name:'Ballı Meyve Reçeli',icon:'🍓',shop:'recelci',unlock:50,durationDays:.9,honeyKg:1,inputs:{fruitBase:1,jamBase:1}},
  {id:'lavenderHoneyJam',name:'Lavantalı Bal Reçeli',icon:'💜',shop:'recelci',unlock:50,durationDays:1,honeyKg:1,honeyFlower:'lavanta',inputs:{jamBase:1}},
  {id:'chestnutHoneyJam',name:'Kestane Ballı Reçel',icon:'🌰',shop:'recelci',unlock:50,durationDays:1,honeyKg:1,honeyFlower:'kestane',inputs:{jamBase:1}},
  {id:'premiumHoneyJamSet',name:'Premium Bal-Reçel Seti',icon:'🎁',shop:'recelci',unlock:50,durationDays:1.3,honeyKg:2,inputs:{premiumJamJar:1}},
  // Marangoz
  {id:'woodHoneySet',name:'Ahşap Bal Seti',icon:'🪵',shop:'marangoz',unlock:57,durationDays:1.1,honeyKg:2,inputs:{woodGiftBox:1}},
  {id:'beekeeperGiftChest',name:'Arıcı Hediye Sandığı',icon:'🧰',shop:'marangoz',unlock:57,durationDays:1.4,honeyKg:3,waxKg:.2,inputs:{premiumChest:1}},
  {id:'luxuryHoneyCandleChest',name:'Lüks Bal & Mum Sandığı',icon:'🎁',shop:'marangoz',unlock:57,durationDays:1.8,honeyKg:4,waxKg:.4,inputs:{woodDisplayCrate:1}},
  // Lokumcu
  {id:'honeyLokum',name:'Ballı Lokum',icon:'🍬',shop:'lokumcu',unlock:67,durationDays:.8,honeyKg:1,inputs:{plainLokum:1}},
  {id:'lavenderHoneyLokum',name:'Lavantalı Ballı Lokum',icon:'🍬',shop:'lokumcu',unlock:67,durationDays:.9,honeyKg:1,honeyFlower:'lavanta',inputs:{premiumLokumBase:1}},
  {id:'royalHoneyLokum',name:'Arı Sütlü Ballı Lokum',icon:'🍡',shop:'lokumcu',unlock:67,durationDays:1.1,honeyKg:1,materials:{royalJelly:15},inputs:{premiumLokumBase:1}},
  {id:'premiumLokumBoxProduct',name:'Premium Lokum Kutusu',icon:'🎁',shop:'lokumcu',unlock:67,durationDays:1.2,honeyKg:2,inputs:{lokumBox:1}}
].map((r) => ({...r, outputCount:1}));

const INPUTS = Object.fromEntries(SHOPS.flatMap((s) => s.inputs).map((x) => [x.id,x]));
const RECIPES_BY_ID = Object.fromEntries(RECIPES.map((x) => [x.id,x]));
const SHOPS_BY_ID = Object.fromEntries(SHOPS.map((x) => [x.id,x]));

function inputBasePrice(input) {
  if (!input) return 0;
  const raw = 12 + input.unlock * 1.55 + input.grade * 8;
  return Math.max(10, Math.round(raw / 5) * 5);
}

module.exports = { SHOPS, SHOPS_BY_ID, INPUTS, RECIPES, RECIPES_BY_ID, inputBasePrice };