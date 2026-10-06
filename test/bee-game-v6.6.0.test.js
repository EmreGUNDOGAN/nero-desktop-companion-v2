const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { BeeGame } = require('../src/main/bee');

class MemoryStore {
  constructor(value = null) { this.value = value; }
  get() { return this.value; }
  set(value) { this.value = JSON.parse(JSON.stringify(value)); }
  flush() {}
}
function freshGame() { return new BeeGame(new MemoryStore()); }
function firstHive(bee) { return Object.values(bee.state.hives)[0]; }

const root = path.join(__dirname, '..');

test('6.6.0 Odak Bonusu backend, renderer ve rehberde yüzde 10dur', () => {
  const bee = freshGame();
  assert.equal(bee.view().focusBoost, 0.10);
  const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const guide = fs.readFileSync(path.join(root, 'OYUN-REHBERI.md'), 'utf8');
  assert.doesNotMatch(renderer, /Odak Bonusu[^\n]{0,80}\+%25/);
  assert.match(html, /tohum fiyatının <b>%25'ine canlandırabilirsin<\/b>/);
  assert.doesNotMatch(html, /tohum fiyatının <b>%10'una canlandırabilirsin<\/b>/);
  assert.doesNotMatch(renderer, /text: '\+%25 bal üretimi'/);
  assert.match(guide, /Odak bonusu[^\n]*\+%10/);
  assert.match(guide, /Odak bonusu \| ×1\.10/);
});

test('6.6.0 solmuş ve undoPending tarhlar cluster bonusuna girmez', () => {
  const bee = freshGame();
  // Varsayılan adadaki çiçekleri temizle; yalnız test kümesi sonucu etkilesin.
  for (const t of Object.values(bee.state.tiles)) if (t.item && t.item.type === 'flower') t.item = null;
  for (const k of ['-1,0', '0,-1', '-1,1']) {
    bee.state.tiles[k].owned = true;
    bee.state.tiles[k].kind = 'grass';
    bee.state.tiles[k].item = { type: 'flower', flower: 'yonca', plantedDay: 0, wilted: false };
  }
  assert.equal(bee.clusterBonus('-1,0'), 0.15);
  bee.state.tiles['-1,1'].item.wilted = true;
  assert.equal(bee.clusterBonus('-1,0'), 0);
  bee.state.tiles['-1,1'].item.wilted = false;
  bee.state.tiles['-1,1'].item.undoPending = true;
  assert.equal(bee.clusterBonus('-1,0'), 0);
});

test('6.6.0 orderableFlowers yalnız kovana erişen ve kesinleşmiş tarhları döndürür', () => {
  const bee = freshGame();
  bee.state.tiles['7,-7'] = { q: 7, r: -7, kind: 'grass', owned: true, item: { type: 'flower', flower: 'kestane', plantedDay: 0, wilted: false } };
  assert.ok(bee.plantedFlowers().includes('kestane'));
  assert.ok(!bee.orderableFlowers().includes('kestane'));
  bee.state.tiles['1,-1'].item.undoPending = true;
  assert.ok(!bee.orderableFlowers().includes('yonca'));
});

test('6.6.0 kabul edilmiş sipariş balı pazar, Yakup, turnuva ve Atölyeden korunur', () => {
  const bee = freshGame();
  bee.state.storageCap = 100;
  bee.state.storage.yonca = 10;
  bee.state.orders.list = [{ id:'ord', who:'Ayşe', flower:'yonca', kg:8, reward:100, days:3, status:'accepted', deadlineClock:999999 }];
  assert.equal(bee.availableHoneyKg('yonca'), 2);
  const sold = bee.sellHoney('yonca', 'all');
  assert.equal(sold.ok, true);
  assert.equal(Math.round(bee.state.storage.yonca * 10) / 10, 8);

  bee.state.merchant = { active:true, wants:'yonca', wantsLeft:10, salesTicketKg:0, stock:[], bought:[], sandik:0, until:99 };
  assert.equal(bee.merchantSell('all').ok, false);

  bee.state.gameMs = 11 * bee.view().dayMs; // 12. gün
  assert.equal(bee.enterFestival('yonca', 8).ok, false);

  bee.state.village.arrived = Array.from({length:30}, (_,i)=>i+1);
  const recipe = bee.workshopRecipe('premiumJar','yonca');
  assert.equal(bee.workshopRecipeIngredients(recipe).find(x=>x.key==='honey').have, 0);
  assert.equal(bee.enqueueWorkshop('premiumJar','yonca').ok, false);
});

test('6.6.0 Atölye iptali depo kapasitesini aşamaz', () => {
  const bee = freshGame();
  bee.state.village.arrived = Array.from({length:30}, (_,i)=>i+1);
  bee.state.storageCap = 10;
  bee.state.storage.yonca = 9;
  bee.state.workshop.queue = [{ id:'q', recipe:'pollenCake', refund:{ honey:{yonca:2}, wax:0, materials:{}, premiumJars:{}, waxPressUses:0 } }];
  const r = bee.cancelWorkshopJob('q');
  assert.equal(r.ok, false);
  assert.equal(bee.state.workshop.queue.length, 1);
  assert.equal(bee.state.storage.yonca, 9);
});

test('6.6.0 festival iadesi depoyu aşmaz ve fazlası beklemede kalır', () => {
  const bee = freshGame();
  bee.state.storageCap = 10;
  bee.state.storage.yonca = 9;
  const ret = bee.queueHoneyReturn('yonca', 4);
  assert.equal(ret.accepted, 1);
  assert.equal(ret.overflow, 3);
  assert.equal(bee.totalStoredHoney(), 10);
  assert.equal(bee.state.pendingHoneyReturns.yonca, 3);
  bee.state.storage.yonca -= 4;
  bee.flushPendingHoneyReturns();
  assert.equal(bee.state.pendingHoneyReturns.yonca || 0, 0);
  assert.equal(bee.state.storage.yonca, 9);
});

test('6.6.0 özel siparişler toplam sipariş limitini aşmaz', () => {
  const bee = freshGame();
  bee.fx = (k) => k === 'firin' ? 1 : 0;
  bee.state.village.special.firin = -100;
  bee.state.orders.list = Array.from({length: bee.orderMax()}, (_,i)=>({id:'x'+i, special:null, status:'open'}));
  bee.specialOrders();
  assert.equal(bee.state.orders.list.length, bee.orderMax());
});

test('6.6.0 özel sipariş sahte ilişki yaratmaz ve ilişki jetonunu tüketmez', () => {
  const bee = freshGame();
  bee.state.storage.yonca = 10;
  bee.state.merchantEffects.friendToken = 10;
  bee.state.merchantEffects.priorityCard = 4;
  bee.state.orders.list = [{ id:'sp', who:'🍞 Fırın', flower:'yonca', kg:2, reward:50, days:4, status:'accepted', deadlineClock:999999, special:'firin' }];
  assert.equal(bee.deliverOrder('sp').ok, true);
  assert.equal(bee.state.customers['🍞 Fırın'], undefined);
  assert.equal(bee.state.merchantEffects.friendToken, 10);
  assert.equal(bee.state.merchantEffects.priorityCard, 4);
});

test('6.6.0 renderer 500+ tekli ve toplu canlandırma maliyetini onay sistemine verir', () => {
  const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  assert.match(renderer, /case 'replant'/);
  assert.match(renderer, /case 'reviveAll'/);
  assert.match(renderer, /if \(cost >= 500/);
});

test('6.6.0 kapalı/uyku aralığında sipariş catch-up en fazla 3tür', () => {
  const seed = freshGame().state;
  seed.orders.list = [];
  seed.orderClockMs = 0;
  seed.orders.nextAtClock = 5 * 60 * 1000;
  seed.orders.lastWallAt = Date.now() - 60 * 60 * 1000;
  const bee = new BeeGame(new MemoryStore(seed));
  const normal = bee.state.orders.list.filter(x=>!x.special);
  assert.ok(normal.length <= 3);
  assert.ok(normal.length > 0);
});

test('6.6.0 eski şişmiş rakip migrasyonu honeyByFlower stokunu gerçekten küçültür', () => {
  const base = freshGame().state;
  base.rivalDayRateFixed = false;
  base.rivals = [
    {id:'ali',nw:999999,history:[999999],farm:{coins:0,hives:10,bees:20,honey:10000,honeyByFlower:{yonca:6000,kestane:4000},capital:9000}},
    {id:'kaya',nw:1000,history:[],farm:{coins:1000,hives:1,bees:4,honey:0,honeyByFlower:{},capital:900}},
    {id:'nur',nw:1000,history:[],farm:{coins:1000,hives:1,bees:4,honey:0,honeyByFlower:{},capital:900}},
  ];
  const bee = new BeeGame(new MemoryStore(base));
  const farm = bee.state.rivals.find(r=>r.id==='ali').farm;
  assert.ok(bee.rivalHoneyTotal(farm) <= farm.hives * 2 + 1e-6);
});

test('6.6.0 günlük görevler menzilsiz sahte kovanları harvest3 saymaz', () => {
  const bee = freshGame();
  const h = firstHive(bee);
  bee.state.hives.fake1 = {...JSON.parse(JSON.stringify(h)), id:'fake1', name:'fake1'};
  bee.state.hives.fake2 = {...JSON.parse(JSON.stringify(h)), id:'fake2', name:'fake2'};
  const types = bee.questCandidates().map(q=>q.type);
  assert.ok(!types.includes('harvest3Hives'));
});

test('6.6.0 görev, hikaye ve mektup jetonları earned sayacına girer', () => {
  const bee = freshGame();
  const before = bee.state.counters.earned;
  bee.state.quests = { day: bee.todayKey(), refreshFree:2, paidUsed:false, list:[{id:'q',type:'plant',family:'plant',target:1,reward:77,progress:1,claimed:false,seen:[]}] };
  assert.equal(bee.claimQuest('q').ok, true);
  assert.equal(bee.state.counters.earned - before, 77);
});

test('6.6.0 arı al-sat geçmiş invested birikimi net değeri şişirmez', () => {
  const bee = freshGame();
  const h = firstHive(bee);
  const baseValue = bee.hiveValue(h);
  h.invested = 9999999;
  assert.equal(bee.hiveValue(h), baseValue);
  bee.state.coins = 100000;
  const afterSet = bee.netWorth();
  assert.equal(bee.buyBee(h.id).ok, true);
  const afterBuy = bee.netWorth();
  assert.ok(afterBuy <= afterSet + 2);
  assert.equal(bee.sellBee(h.id).ok, true);
  const afterSell = bee.netWorth();
  assert.ok(afterSell <= afterBuy + 2);
});

test('6.6.0 eski depo yatırım migrasyonu bilinmeyen kuponu tam fiyat diye yazmaz', () => {
  const base = freshGame().state;
  delete base.storageInvested;
  base.storageBaseCap = 10000;
  base.storageCap = 10000;
  const bee = new BeeGame(new MemoryStore(base));
  assert.equal(bee.state.storageInvested, 0);
  assert.equal(bee.state.storageInvestedEstimated, true);
  assert.ok(bee.storageAssetValue() > 0);
});

test('6.6.0 stok değişim başarısızsa Yakup para ve stok durumunu değiştirmez', () => {
  const bee = freshGame();
  bee.state.coins = 500;
  bee.state.merchant = {active:true,stock:[{id:'stokDegisim',sold:false},{id:'surup',sold:false}],bought:[],sandik:0,wants:'yonca',wantsLeft:10,salesTicketKg:0,until:99};
  bee.makeMerchantStock = () => null;
  const before = bee.state.coins;
  const r = bee.merchantBuy('stokDegisim','surup');
  assert.equal(r.ok, false);
  assert.equal(bee.state.coins, before);
  assert.equal(bee.state.merchant.stock[0].sold, false);
});

test('6.6.1 turnuvada rakip önceden ayırdığı gerçek stokla katılır ve derece ödülü ekonomisine eklenir', () => {
  const bee = freshGame();
  for (const r of bee.state.rivals) {
    r.farm.honeyByFlower = { yonca: 10 };
    r.farm.tournamentReserve = { flower:'yonca', kg:10, seasonIndex:0 };
    r.farm.coins = 100;
    r.farm.seasonProduction = 20;
  }
  const beforeCoins = bee.state.rivals.map(r=>r.farm.coins);
  bee.state.gameMs = 14 * bee.view().dayMs;
  bee.judgeFestival(14);
  bee.state.rivals.forEach((r,i)=>{
    assert.equal(r.farm.tournamentReserve, null);
    assert.ok(r.farm.coins >= beforeCoins[i]);
  });
});

test('6.6.0 rehber ve renderer temel kurallarda backend ile ayrışmaz', () => {
  const html = fs.readFileSync(path.join(root,'src/renderer/bee/index.html'),'utf8');
  const guide = fs.readFileSync(path.join(root,'docs/ARICILIK-REHBERI.md'),'utf8');
  assert.match(html, /2 saat/);
  assert.match(guide, /2 saat/);
  assert.doesNotMatch(guide, /yan ürün[^\n]{0,80}yer tutucu/i);
  assert.match(html, /1\. 300 🪙/);
  assert.match(guide, /300 \/ 200 \/ 100/);
  assert.match(guide, /\+%6[^\n]{0,40}bal üretimi/);
  assert.match(guide, /\+%12[^\n]{0,40}bal üretimi/);
  assert.match(guide, /-%8/);
});


test('6.6.0 manuel duraklatmada da gerçek-zaman sipariş saati işler', () => {
  const bee = freshGame();
  const now = Date.now();
  bee.state.speed = 0;
  bee.state.orders.list = [];
  bee.state.orderClockMs = 0;
  bee.state.orders.nextAtClock = 5 * 60 * 1000;
  bee.state.lastSeenAt = now;
  bee.lastTickAt = now - 5 * 60 * 1000;
  bee.makeOrder = kind => kind === 'product' ? null : ({ id:'rt', who:'Test', flower:'yonca', kg:2, reward:10, days:2, status:'open', deadline:null });
  bee.tick(now);
  assert.equal(bee.state.orders.list.length, 1);
  assert.equal(bee.state.orders.list[0].id, 'rt');
});

test('6.6.0 Pazar Tahmini oku çarpana değil yarının nihai fiyatına bakar', () => {
  const bee = freshGame();
  const current = bee.price('yonca');
  bee.state.merchantEffects.marketForecast = {
    forDay: bee.dayIndex() + 1,
    nextMult: { yonca: 1.30 },
    nextPrices: { yonca: Math.max(0.1, current - 1) },
    nextEvent: null,
    reveal: ['yonca']
  };
  const row = bee.view().marketForecast.rows[0];
  assert.equal(row.direction, 'down');
  assert.equal(row.predictedPrice, Math.max(0.1, current - 1));
});

test('6.6.0 tohum ekmek, dekor yerleştirmek ve fayda ürünü saklamak net değerde kaybolmaz', () => {
  const bee = freshGame();
  bee.state.coins = 5000;
  assert.equal(bee.buySeed('yonca').ok, true);
  const afterSeedBuy = bee.netWorth();
  const empty = Object.entries(bee.state.tiles).find(([, t]) => t.owned && t.kind === 'grass' && !t.item && !t.decor);
  assert.ok(empty);
  assert.equal(bee.plantSeed(empty[0], 'yonca').ok, true);
  assert.ok(Math.abs(bee.netWorth() - afterSeedBuy) <= 1);

  assert.equal(bee.buyDecor('cit').ok, true);
  const afterDecorBuy = bee.netWorth();
  const empty2 = Object.entries(bee.state.tiles).find(([k, t]) => k !== empty[0] && t.owned && t.kind === 'grass' && !t.item && !t.decor);
  assert.ok(empty2);
  assert.equal(bee.placeDecor(empty2[0], 'cit').ok, true);
  assert.ok(Math.abs(bee.netWorth() - afterDecorBuy) <= 1);

  const beforeUtility = bee.netWorth();
  bee.state.workshop.products.propolisShield = 1;
  assert.ok(bee.netWorth() > beforeUtility);
});

test('6.6.1 rakip her tarhın mevsim tohumunu gerçekten öder; aynı mevsimde tekrar ödemez', () => {
  const bee = freshGame();
  const nur = bee.state.rivals.find((r) => r.id === 'nur');
  nur.farm.coins = 10000;
  nur.farm.plots = [{id:'p1',flower:'yonca',active:false,seasonIndex:-1},{id:'p2',flower:'yonca',active:false,seasonIndex:-1}];
  const before = nur.farm.coins;
  bee.rivalPreparePlots(nur, 0, 'ilkbahar', []);
  const after = nur.farm.coins;
  assert.ok(after < before);
  bee.rivalPreparePlots(nur, 0, 'ilkbahar', []);
  assert.equal(nur.farm.coins, after);
});

test('6.6.0 UI rezerve ve bekleyen balı kullanıcıya açıkça gösterir', () => {
  const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  assert.match(renderer, /wantsAvailable/);
  assert.match(renderer, /Siparişe ayrılmış/);
  assert.match(renderer, /Bekleyen bal iadesi/);
  assert.match(renderer, /Satılabilirin hepsini sat/);
});

test('6.6.0 proje özeti eski 3 saat, canlandırma yüzde 10 ve Yakup yüzde 20 kurallarını taşımaz', () => {
  const intro = fs.readFileSync(path.join(root, 'docs/NERO-PROJE-TANITIMI.md'), 'utf8');
  assert.match(intro, /2 saat bakılmazsa/);
  assert.match(intro, /tohumun %25'ine canlanır/);
  assert.match(intro, /pazarın %15 üstüne alır/);
  assert.doesNotMatch(intro, /3 saat bakılmazsa/);
  assert.doesNotMatch(intro, /tohumun %10'una canlanır/);
  assert.doesNotMatch(intro, /pazarın %20 üstüne alır/);
});

test('6.6.0 tarihsel plan dosyaları güncel kural kaynağı olmadığını açıkça belirtir', () => {
  for (const rel of ['docs/ARICILIK-KILITLI-YENI-SISTEMLER.md', 'docs/NERO-6.3.4-PLAN-PART-04.md']) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    assert.match(text, /ARŞİV NOTU \(6\.6\.0\)/);
    assert.match(text, /güncel/i);
  }
});


test('6.8.1 paket sürümü ve Actions workflowu yeni sürüme bağlıdır', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/build-v6.8.1.yml'), 'utf8');
  assert.equal(pkg.version, '9.6.6');
  assert.equal(lock.version, '9.6.6');
  assert.equal(lock.packages[''].version, '9.6.6');
  assert.match(workflow, /name: Build Nero 6\.8\.1 Final/);
  assert.match(workflow, /branches: \[feature\/bee-v6\.8\.1\]/);
  assert.match(workflow, /Nero-6\.8\.1-final-bundle/);
});