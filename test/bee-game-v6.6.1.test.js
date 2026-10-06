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
const root = path.join(__dirname, '..');

test('6.8.1 sürüm ve workflow bağlıdır; 6.6.1 master planı tarihsel olarak korunur', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/build-v6.8.1.yml'), 'utf8');
  const plan = fs.readFileSync(path.join(root, 'docs/NERO-6.6.1-IMPLEMENTASYON-PLANI.md'), 'utf8');
  assert.equal(pkg.version, '6.9.2');
  assert.equal(lock.version, '6.9.2');
  assert.equal(lock.packages[''].version, '6.9.2');
  assert.match(workflow, /Build Nero 6\.8\.1 Final/);
  assert.match(workflow, /feature\/bee-v6\.8\.1/);
  assert.match(workflow, /Nero-6\.8\.1-final-bundle/);
  assert.match(plan, /\| 0 \| 6\.6\.1 temel sürüm \/ migration \/ test altyapısı \| ✅ TAMAMLANDI \|/);
});

test('6.6.1 migration aynı save ikinci kez açıldığında temel state kaybetmez', () => {
  const first = freshGame();
  first.state.coins = 4321;
  first.state.storage.yonca = 12.3;
  const snapshot = JSON.parse(JSON.stringify(first.state));
  const once = new BeeGame(new MemoryStore(snapshot));
  const twice = new BeeGame(new MemoryStore(JSON.parse(JSON.stringify(once.state))));
  assert.equal(twice.state.coins, once.state.coins);
  assert.equal(twice.state.storage.yonca, once.state.storage.yonca);
  assert.deepEqual(Object.keys(twice.state.hives).sort(), Object.keys(once.state.hives).sort());
  assert.equal(twice.state.village.arrived.length, once.state.village.arrived.length);
});

test('6.6.1 turnuva ödülleri tek kaynakta 300 / 200 / 100dür', () => {
  const bee = freshGame();
  assert.deepEqual(bee.view().festival.prizes.map(x => x.coins), [300, 200, 100]);
  const renderer = fs.readFileSync(path.join(root,'src/renderer/bee/bee.js'),'utf8');
  const html = fs.readFileSync(path.join(root,'src/renderer/bee/index.html'),'utf8');
  const guide = fs.readFileSync(path.join(root,'docs/ARICILIK-REHBERI.md'),'utf8');
  assert.match(renderer, /coins: 300/);
  assert.match(html, /1\. 300 🪙/);
  assert.match(guide, /300 \/ 200 \/ 100/);
  assert.doesNotMatch(html, /1\. 750 🪙/);
});

test('6.6.1 turnuva parası cüzdana gelir ama rekabetçi net değere girmez', () => {
  const bee = freshGame();
  const beforeRaw = bee.netWorth();
  const beforeComp = bee.competitiveNetWorth();
  bee.state.coins += 300;
  bee.state.competitiveExcludedEquity += 300;
  assert.equal(bee.netWorth(), beforeRaw + 300);
  assert.equal(bee.competitiveNetWorth(), beforeComp);
  // Para bir varlığa çevrilse bile dışlanan ana para yeniden liderliğe sızmaz.
  bee.state.coins -= 45;
  bee.state.vouchers.yonca = (bee.state.vouchers.yonca || 0) + 1;
  assert.ok(Math.abs(bee.competitiveNetWorth() - beforeComp) <= 3);
});

test('6.6.1 rakip turnuvaya hayali bal sokamaz', () => {
  const bee = freshGame();
  const r = bee.state.rivals[0];
  r.farm.honeyByFlower = {};
  r.farm.tournamentReserve = null;
  const stats = bee.rivalFestivalStats(r, 'ilkbahar', 0);
  assert.equal(stats, null);
});

test('6.6.1 rakip tohumu alamazsa o tarh aktif üretime geçmez', () => {
  const bee = freshGame();
  const r = bee.state.rivals.find(x=>x.id==='kaya');
  r.farm.coins = 0;
  r.farm.plots = [{id:'p1',flower:'yonca',active:false,seasonIndex:-1}];
  bee.rivalPreparePlots(r, 0, 'ilkbahar', []);
  assert.equal(r.farm.plots[0].active, false);
  assert.equal(r.farm.coins, 0);
});

test('6.6.1 rakip kapasite doluyken önce yükseltme ödemeden arı alamaz', () => {
  const bee = freshGame();
  const r = bee.state.rivals.find(x=>x.id==='nur');
  r.farm.coins = 1000;
  r.farm.hivesData = [{id:'h',bees:10,capBees:10,capKg:20,level:0,queens:0,syrup:0,breed:'italyan',sick:false,immuneUntil:0}];
  r.farm.plots = [{id:'p',flower:'yonca',active:true,seasonIndex:0}];
  bee.syncRivalFarm(r.farm);
  const before = r.farm.coins;
  bee.rivalInvest(r,'ilkbahar',1000,[]);
  assert.ok(r.farm.hivesData[0].level >= 1);
  assert.ok(r.farm.coins <= before - 340);
  assert.ok(r.farm.hivesData[0].bees <= r.farm.hivesData[0].capBees);
});

test('6.6.1 turnuva sonucu mevsimin 15. gününde çalışır', () => {
  const src = fs.readFileSync(path.join(root,'src/main/bee.js'),'utf8');
  assert.match(src, /dayIdx % DAYS_PER_SEASON === DAYS_PER_SEASON - 1\) this\.judgeFestival\(dayIdx\)/);
  assert.match(src, /Sonuç 15\. gün açıklanacak/);
});

test('6.6.1 tarh bonusu yalnız kendi bal payına uygulanır; global yüzde toplanmaz', () => {
  const bee = freshGame();
  for (const t of Object.values(bee.state.tiles)) if (t.item?.type === 'flower') t.item = null;
  bee.state.tiles['1,-1'].item = {type:'flower',flower:'yonca',plantedDay:0};
  const hive = Object.values(bee.state.hives)[0];
  const one = bee.hiveRates(hive.id);
  bee.state.tiles['0,1'].item = {type:'flower',flower:'kestane',plantedDay:0};
  const two = bee.hiveRates(hive.id);
  // Kestanenin +%22'si yoncaya global olarak eklenmez; yoncanın payı iki tarha bölünür.
  assert.ok(two.yonca < one.yonca * 0.7);
  assert.ok(two.kestane > 0);
  const effects = bee.hiveProductionEffects(hive.id);
  assert.ok(!effects.some(x => /Tarh üretim bonusları/.test(x.label)));
  assert.ok(effects.some(x => /Yonca tarh bonusu/.test(x.label) && /^×/.test(x.value)));
});

test('6.6.1 biyoçeşitlilik bal üretimine global çarpan eklemez', () => {
  const bee = freshGame();
  const h = Object.values(bee.state.hives)[0];
  const eco = bee.hiveEcosystem(h.id);
  assert.equal(eco.productionBonus, 0);
  assert.ok('qualityBonus' in eco);
  assert.ok(!bee.hiveProductionEffects(h.id).some(x => x.label === '🌿 Biyoçeşitlilik' && x.mult !== 1));
});


test('6.6.1 Atölye 9. sırada, Fırın 30. sıradadır', () => {
  const village = require('../src/main/village-data');
  assert.equal(village[8].n, 9);
  assert.equal(village[8].name, 'Arıcılık Atölyesi');
  assert.equal(village[29].n, 30);
  assert.equal(village[29].name, 'Fırın');
  const bee = freshGame();
  bee.state.village.arrived = Array.from({ length: 8 }, (_, i) => i + 1);
  assert.equal(bee.workshopUnlocked(), false);
  bee.state.village.arrived.push(9);
  assert.equal(bee.workshopUnlocked(), true);
  assert.equal(bee.workshopLevel(), 1);
});

test('6.6.1 Atölye kendi sayfasında üretim ve rehber sekmelerine sahiptir', () => {
  const html = fs.readFileSync(path.join(root,'src/renderer/bee/index.html'),'utf8');
  const js = fs.readFileSync(path.join(root,'src/renderer/bee/bee.js'),'utf8');
  assert.match(html, /data-workshop-tab="production"/);
  assert.match(html, /data-workshop-tab="guide"/);
  assert.match(html, /Rehber \/ Nasıl Çalışır\?/);
  assert.match(html, /9\. yerleşimcisi/);
  assert.match(js, /function setWorkshopTab/);
  assert.doesNotMatch(js, /Mumcu köye geldiğinde açılır/);
});


test('6.6.1 fiziksel Pazar işaretli -3,0 karesindedir ve save migration onu ayırır', () => {
  const bee = freshGame();
  assert.equal(bee.view().marketTile, '-3,0');
  assert.equal(bee.state.tiles['-3,0'].kind, 'market');
  assert.equal(bee.state.tiles['-3,0'].owned, false);
});

test('6.6.1 fiziksel Pazar tıklaması aynı Pazar ekranını açar', () => {
  const js = fs.readFileSync(path.join(root,'src/renderer/bee/bee.js'),'utf8');
  const marketVisual = fs.readFileSync(path.join(root,'src/renderer/bee/gorsel/pazar.js'),'utf8');
  assert.match(js, /t\.kind === 'market'\) \{ openMarket\(\); return; \}/);
  assert.match(js, /makePhysicalMarket/);
  assert.match(marketVisual, /Haritada kalıcı fiziksel Pazar/);
});

test('6.6.1 Pazarcı kalıcıdır ve dükkân sahipleri günlük Pazara yürür', () => {
  const life = fs.readFileSync(path.join(root,'src/renderer/bee/village-life.js'),'utf8');
  assert.match(life, /marketSeller\.visible = true/);
  assert.match(life, /p\.type === 'dukkan'/);
  assert.match(life, /walkers\.move\(p\.agent, marketKey/);
  assert.match(life, /Pazara ürün bıraktım/);
});

test('6.6.1 aşama 5: açılan dükkân yarı mamulleri pazara gelir ve satın alınabilir', () => {
  const bee = freshGame();
  bee.state.coins = 10000;
  const market = bee.shopMarketView();
  assert.ok(market.some((s) => s.id === 'bakkal'));
  const input = market.find((s) => s.id === 'bakkal').inputs[0];
  const before = bee.state.commercialInputs[input.id] || 0;
  assert.equal(bee.buyMarketInput(input.id, 1).ok, true);
  assert.equal(bee.state.commercialInputs[input.id], before + 1);
});

test('6.6.1 aşama 5: ticari ürün fiyatı gerçek girdilerden yüksek ve zarar ettirmez', () => {
  const bee = freshGame();
  bee.state.village.arrived = Array.from({length: 9}, (_, i) => i + 1);
  bee.state.commercialInputs.smallGiftBox = 1;
  bee.state.storage.yonca = 10;
  const r = bee.workshopRecipe('honeyGiftBox');
  const cost = bee.commercialRecipeCost(r);
  const value = bee.workshopProductValue('honeyGiftBox');
  assert.ok(value > cost);
  assert.ok(bee.workshopMaxCraftable(r) >= 1);
});

test('6.6.1 aşama 5: ürün siparişi ortak limite girer, teslim edilir ve ürün rezervasyonu satışı korur', () => {
  const bee = freshGame();
  bee.state.village.arrived = Array.from({length: 9}, (_, i) => i + 1);
  bee.state.workshop.products.goods.honeyGiftBox = 2;
  const pool = bee.orderPeoplePool();
  const who = pool[0].name;
  const order = { id:'prod-order', kind:'product', who, productId:'honeyGiftBox', count:1, reward:200, days:3, status:'accepted', deadlineClock:9999999 };
  bee.state.orders.list = [order];
  assert.equal(bee.availableProductCount('honeyGiftBox'), 1);
  assert.equal(bee.sellWorkshopProduct('honeyGiftBox', 'all').ok, true);
  assert.equal(bee.workshopProductCount('honeyGiftBox'), 1);
  const coins = bee.state.coins;
  assert.equal(bee.deliverOrder('prod-order').ok, true);
  assert.equal(bee.workshopProductCount('honeyGiftBox'), 0);
  assert.ok(bee.state.coins > coins);
  assert.equal(bee.state.ledger.productOrdersDone, 1);
});

test('6.6.1 aşama 5: ürün siparişi yalnız kilidi açılmış ve üretim yolu bulunan tariflerden gelir', () => {
  const bee = freshGame();
  bee.state.village.arrived = Array.from({length: 9}, (_, i) => i + 1);
  bee.restockShopMarket(bee.dayIndex());
  const ids = bee.commercialOrderCandidates().map((r) => r.id);
  assert.ok(ids.includes('honeyGiftBox'));
  assert.ok(!ids.includes('honeyTart'));
  assert.ok(!ids.includes('honeyRoll'));
});

test('6.6.1 aşama 6: mektup aralığı 30–45 gerçek dakikadır ve oyun hızından bağımsızdır', () => {
  const bee = freshGame();
  bee.state.village.arrived = [1,2,3,4,5,6,7];
  const now = Date.now();
  bee.state.nextLetterAt = now - 1;
  bee.state.letterAway = false;
  bee.state.speed = 4;
  const before = bee.state.letters.length;
  assert.equal(bee.processLetters(now), true);
  assert.equal(bee.state.letters.length, before + 1);
  const delay = bee.state.nextLetterAt - now;
  assert.ok(delay >= 30 * 60 * 1000 && delay <= 45 * 60 * 1000);
});

test('6.6.1 aşama 6: az köylüyle gönderen cooldownu deadlock oluşturmaz', () => {
  const bee = freshGame();
  bee.state.village.arrived = [1,2,3,4,5,6,7];
  bee.state.letters = [];
  bee.state.letterSenderHistory = ['Ayşe Teyze','Mehmet Usta','Küçük Elif','Hacer Nine','Muhtar Rıza'];
  bee.state.letterLastSentByName = {};
  bee.state.letterContentLastDay = {};
  let last = null;
  for (let i = 0; i < 12; i++) {
    const ok = bee.sendLetter(i, 1000 + i);
    assert.equal(ok, true);
    const current = bee.state.letters.at(-1).from;
    if (last) assert.notEqual(current, last);
    last = current;
  }
  assert.equal(bee.state.letters.length, 12);
});

test('6.6.1 aşama 6: aynı mektup metni 3 oyun günü içinde tekrar kullanılamaz', () => {
  const bee = freshGame();
  bee.state.village.arrived = [1,2,3,4,5,6,7];
  bee.state.letters = [];
  bee.state.letterSenderHistory = [];
  bee.state.letterContentLastDay = {};
  for (let i = 0; i < 6; i++) assert.equal(bee.sendLetter(10, 1000 + i), true);
  const ids = bee.state.letters.map(x => x.contentId);
  assert.equal(new Set(ids).size, ids.length);
});

test('6.6.1 aşama 6: kapalı geçen süre en fazla bir catch-up mektubu üretir', () => {
  const bee = freshGame();
  bee.state.village.arrived = [1,2,3,4,5,6,7];
  bee.state.letters = [];
  bee.state.letterAway = true;
  const now = Date.now();
  bee.state.nextLetterAt = now - 3 * 60 * 60 * 1000;
  assert.equal(bee.processLetters(now, { catchup: true, ignoreAway: true }), true);
  assert.equal(bee.state.letters.length, 1);
  assert.equal(bee.processLetters(now, { catchup: true, ignoreAway: true }), false);
  assert.equal(bee.state.letters.length, 1);
});

test('6.6.1 aşama 6: manuel duraklatma mektup sayacını dondurur', () => {
  const bee = freshGame();
  const originalNow = Date.now;
  let fake = 1_000_000;
  Date.now = () => fake;
  try {
    bee.state.nextLetterAt = fake + 10 * 60 * 1000;
    bee.state.speed = 1;
    bee.setSpeed(0);
    fake += 20 * 60 * 1000;
    bee.setSpeed(1);
    assert.equal(bee.state.nextLetterAt, fake + 10 * 60 * 1000);
  } finally { Date.now = originalNow; }
});

test('6.6.1 aşama 6: bildirim tercihi mektubun kendisini engellemez', () => {
  const bee = freshGame();
  bee.state.village.arrived = [1,2,3,4,5,6,7];
  bee.state.gameSettings.notify.letter = false;
  const before = bee.state.letters.length;
  assert.equal(bee.sendLetter(bee.dayIndex(), Date.now()), true);
  assert.equal(bee.state.letters.length, before + 1);
  assert.ok(!bee.pendingAlerts().some(x => x.kind === 'bee_letter'));
});


test('6.6.1 aşama 7: Yaşayan Ada 4 mevsimde 15er, toplam 60 benzersiz ana sahne tanımlar', () => {
  const src = fs.readFileSync(path.join(root,'src/renderer/bee/island-life-events.js'),'utf8');
  const rows = src.match(/^\s+\['[^']+'/gm) || [];
  assert.equal(rows.length, 60);
  for (const season of ['ilkbahar','yaz','sonbahar','kis']) {
    const block = src.split(`${season}: [`)[1].split(/\n\s*\],/)[0];
    assert.equal((block.match(/^\s+\['[^']+'/gm) || []).length, 15, season);
  }
  assert.match(src, /kardan-adam/);
  assert.match(src, /rainLine/);
});

test('6.6.1 aşama 7: oynanan yaşam olayı save state içinde mevsim-yıl anahtarıyla tutulur', () => {
  const bee = freshGame();
  const before = bee.netWorth();
  assert.equal(bee.recordIslandLifeEvent('ilkbahar:cicek-sepeti').ok, true);
  assert.deepEqual(bee.view().islandLife.played, ['ilkbahar:cicek-sepeti']);
  assert.equal(bee.netWorth(), before);
  assert.equal(bee.recordIslandLifeEvent('ilkbahar:cicek-sepeti').ok, true);
  assert.equal(bee.view().islandLife.played.length, 1);
  bee.state.gameMs = bee.view().dayMs * 60; // sonraki oyun yılı ilkbahar
  assert.deepEqual(bee.view().islandLife.played, []);
});

test('6.6.1 aşama 7: NPC yaşamı 18/20 toplu kaybolma kuralını kullanmaz ve festival alanını her gün kullanır', () => {
  const life = fs.readFileSync(path.join(root,'src/renderer/bee/village-life.js'),'utf8');
  const renderer = fs.readFileSync(path.join(root,'src/renderer/bee/bee.js'),'utf8');
  assert.doesNotMatch(life, /hour >= 20\) \{/);
  assert.doesNotMatch(life, /if \(hour >= 18\)/);
  assert.match(life, /visibleWindow/);
  assert.match(life, /hour >= 20\.5/);
  assert.match(life, /socialTick/);
  assert.match(life, /pickIslandLifeEvent/);
  assert.match(renderer, /festival: \(\) => \['-5,2', '-6,2', '-4,2'\]/);
  assert.match(renderer, /festivalOpen: \(\) => !!view\?\.festival\?\.open/);
});

test('6.6.1 aşama 7: yaşam olayları ekonomik ödül üretmez', () => {
  const bee = freshGame();
  const coins = bee.state.coins;
  const storage = structuredClone(bee.state.storage);
  bee.recordIslandLifeEvent('ilkbahar:bank-sohbeti');
  assert.equal(bee.state.coins, coins);
  assert.deepEqual(bee.state.storage, storage);
});


test('6.6.1 aşama 8: güncellemeler gerçek başlık ve ayrı açıklama kullanır', () => {
  const notes = fs.readFileSync(path.join(root,'src/renderer/bee/release-notes.js'),'utf8');
  assert.match(notes, /title: `Nero \$\{version\}`/);
  assert.match(notes, /\^#\{1,3\}/);
  assert.doesNotMatch(notes, /boldLead/);
  assert.doesNotMatch(notes, /title: i === 0 \? 'Sürüm özeti'/);
});

test('6.6.1 aşama 8: son 10 yayımlanmış sürüm için temizlenmiş yapılandırılmış not vardır', () => {
  const notes = fs.readFileSync(path.join(root,'src/renderer/bee/release-notes.js'),'utf8');
  const versions = ['6.5.0','6.4.0','6.3.14','6.3.11','6.3.0','6.2.0','6.1.0','6.0.0','5.5.6','5.5.4'];
  for (const version of versions) assert.match(notes, new RegExp(`'${version.replace(/\./g,'\\.')}'\\s*:`), version);
  assert.match(notes, /CURATED_RECENT_VERSIONS/);
});

test('6.6.1 aşama 8: update ekranı sürüm release linkini ve geri ileri gezinmeyi korur', () => {
  const html = fs.readFileSync(path.join(root,'src/renderer/bee/index.html'),'utf8');
  const js = fs.readFileSync(path.join(root,'src/renderer/bee/bee.js'),'utf8');
  assert.match(html, /id="whats-new-release-link"/);
  assert.match(html, /id="whats-new-prev"/);
  assert.match(js, /releaseIndex \+= 1/);
  assert.match(js, /releaseIndex -= 1/);
  assert.match(js, /openRelease/);
});

test('6.6.1 aşama 9: Pazar Tahmin Kartı ertesi gün gerçekten uygulanacak piyasa stateini kilitler', () => {
  const bee = freshGame();
  bee.state.coins = 10000;
  bee.state.merchant.active = true;
  bee.state.merchant.stock = [{ id: 'pazarTahmin', sold: false }];
  bee.state.merchant.bought = [];
  assert.equal(bee.merchantBuy('pazarTahmin').ok, true);
  const fc = structuredClone(bee.state.merchantEffects.marketForecast);
  assert.ok(fc && fc.forDay === bee.dayIndex() + 1);
  bee.state.gameMs = fc.forDay * 15 * 60 * 1000;
  bee.rollMarket();
  for (const f of Object.keys(fc.nextMult)) assert.equal(bee.state.market.mult[f], fc.nextMult[f], f);
  assert.deepEqual(bee.state.market.event, fc.nextEvent || null);
  assert.equal(bee.state.merchantEffects.marketForecast, null);
});

test('6.6.1 aşama 9: solmuş pahalı çiçeği canlandırmak liderlik değeri üretmez', () => {
  const bee = freshGame();
  bee.state.coins = 10000;
  const key = Object.entries(bee.state.tiles).find(([,t]) => t.owned && t.kind === 'grass' && !t.item && !t.decor)?.[0];
  assert.ok(key);
  bee.state.tiles[key].item = { type:'flower', flower:'kestane', plantedDay:bee.dayIndex()-40, wilted:true, bookValue:0 };
  const before = bee.competitiveNetWorth();
  const cost = bee.reviveCost('kestane');
  assert.equal(bee.replant(key).ok, true);
  const after = bee.competitiveNetWorth();
  assert.ok(after <= before, `canlandırma net değer üretmemeli: ${before} -> ${after}, maliyet ${cost}`);
  assert.ok(Math.abs(bee.state.tiles[key].item.bookValue - cost * 0.95) < 1);
});

test('6.6.1 aşama 9: indirimli tohum alımı hayali net değer yaratmaz', () => {
  const bee = freshGame();
  bee.state.coins = 10000;
  bee.state.village.arrived = Array.from({length:7}, (_,i)=>i+1);
  const flower = bee.ezgiChoice();
  const cost = bee.seedCost(flower);
  const before = bee.netWorth();
  assert.equal(bee.buySeed(flower).ok, true);
  assert.ok(bee.netWorth() <= before, `indirimli tohum net değeri artırmamalı (${flower}, ${cost})`);
  assert.ok((bee.state.voucherBasis[flower] || 0) <= cost);
});

test('6.6.1 aşama 9: üretim yolu yoksa hasat ve stok yoksa satış günlük görevi doğmaz', () => {
  const bee = freshGame();
  bee.state.storage = {};
  for (const h of Object.values(bee.state.hives)) h.honey = {};
  for (const t of Object.values(bee.state.tiles)) if (t.item?.type === 'flower') t.item = null;
  const candidates = bee.questCandidates();
  assert.ok(!candidates.some(q => ['harvest','harvestFlower','harvestPremium','harvest2Types','harvest3Types'].includes(q.type)));
  assert.ok(!candidates.some(q => ['sell','sellFlower','saleIncome','winterSell','sell2Transactions','sell2Types'].includes(q.type)));
});

test('6.6.1 aşama 9: günlük satış görevi mevcut serbest stoktan fazlasını istemez', () => {
  const bee = freshGame();
  bee.state.storage = { yonca: 5.4 };
  const candidates = bee.questCandidates().filter(q => q.type === 'sell');
  assert.ok(candidates.length);
  assert.ok(candidates.every(q => q.target <= 5.4));
});

test('6.6.1 aşama 9: dolu eski savede Atölye migrationı mevcut objeyi silmez', () => {
  const base = freshGame();
  const state = structuredClone(base.state);
  const wk = '-1,2';
  state.tiles[wk].kind = 'grass';
  state.tiles[wk].owned = true;
  state.tiles[wk].item = { type:'flower', flower:'yonca', plantedDay:0, wilted:false };
  for (const [k,t] of Object.entries(state.tiles)) {
    if (k === wk) continue;
    if (t.kind === 'grass' && !t.item && !t.decor && !t.tree) t.decor = 'cicek';
  }
  const migrated = new BeeGame(new MemoryStore(state));
  assert.equal(migrated.state.tiles[wk].item?.flower, 'yonca');
  assert.equal(migrated.state.workshopMigrationPending, true);
});

test('6.6.1 aşama 9: ırk değişimi harcanmış hizmettir ve net değeri yapay artırmaz', () => {
  const bee = freshGame();
  bee.state.coins = 10000;
  const h = Object.values(bee.state.hives)[0];
  const before = bee.netWorth();
  assert.equal(bee.changeBreed(h.id, h.breed === 'anadolu' ? 'italyan' : 'anadolu').ok, true);
  assert.ok(bee.netWorth() < before);
  assert.ok((h.serviceSpent || 0) > 0);
});

test('6.6.1 aşama 10: kritik oyun kuralları backendden tek rules görünümüyle yayınlanır', () => {
  const bee = freshGame();
  const r = bee.view().rules;
  assert.deepEqual(r.tournamentPrizes, [300,200,100]);
  assert.equal(r.focusBoostPct, 10);
  assert.equal(r.revivePct, 25);
  assert.equal(r.merchantHoneyBonusPct, 15);
  assert.equal(r.waxGramsPerKg, 25);
  assert.deepEqual([r.letterMinMinutes,r.letterMaxMinutes], [30,45]);
  assert.equal(r.orderEveryMinutes, 5);
  assert.deepEqual(r.tournamentApplyDays, [12,13,14]);
  assert.equal(r.tournamentResultDay, 15);
  assert.equal(r.workshopUnlock, 9);
  assert.equal(r.bakeryUnlock, 30);
  assert.deepEqual(r.biodiversity, { mediumQualityPct:6, highQualityPct:12, monocultureQualityPct:-8, monocultureSicknessMult:1.15 });
});

test('6.6.1 aşama 10: güncel UI ve rehber eski Atölye/mektup/ödül kurallarını taşımıyor', () => {
  const html = fs.readFileSync(path.join(root,'src/renderer/bee/index.html'),'utf8');
  const js = fs.readFileSync(path.join(root,'src/renderer/bee/bee.js'),'utf8');
  const guide = fs.readFileSync(path.join(root,'docs/ARICILIK-REHBERI.md'),'utf8');
  const rootGuide = fs.readFileSync(path.join(root,'OYUN-REHBERI.md'),'utf8');
  for (const source of [html, guide, rootGuide]) {
    assert.doesNotMatch(source, /Mumcu[^\n<]{0,80}Atölye(?: I)?['’]?i açar/i);
    assert.doesNotMatch(source, /1\. 750 🪙|750 \/ 500 \/ 250/);
  }
  assert.doesNotMatch(js, /birkaç günde bir sana mektup/);
  assert.match(html, /Atölye \(9\. yerleşimci\)/);
  assert.match(html, /Fırın 30\. sırada/);
});

test('6.6.1 aşama 10: CI kuralları 6.6.1 gerçek ödül ve kaynak paketini doğrular', () => {
  const wf = fs.readFileSync(path.join(root,'.github/workflows/build-v6.6.1.yml'),'utf8');
  assert.match(wf, /coins: 300, cup: 'altın'/);
  assert.match(wf, /coins: 200, cup: 'gümüş'/);
  assert.match(wf, /coins: 100, cup: 'bronz'/);
  assert.doesNotMatch(wf, /coins: 750, cup/);
  assert.match(wf, /Nero-v6_6_1-source\.zip/);
});

test('6.6.1 aşama 11: dört oyun yıllık uzun simülasyon statei bozmadan tamamlanır', () => {
  const bee = freshGame();
  bee.state.coins = 25000;
  bee.state.village.deliveredKg = 35000;
  bee.checkVillage();
  const dayMs = 15 * 60 * 1000;
  for (let day = 1; day <= 240; day++) {
    bee.state.gameMs = day * dayMs;
    bee.onNewDay(day);
    assert.ok(Number.isFinite(bee.state.coins));
    assert.ok(Number.isFinite(bee.netWorth()));
    assert.ok(Number.isFinite(bee.competitiveNetWorth()));
    for (const kg of Object.values(bee.state.storage || {})) assert.ok(Number.isFinite(kg) && kg >= 0);
    for (const r of bee.state.rivals || []) {
      assert.ok(Number.isFinite(r.nw) && r.nw >= 0);
      assert.ok(Number.isFinite(r.farm?.coins) && r.farm.coins >= 0);
      for (const kg of Object.values(r.farm?.honeyByFlower || {})) assert.ok(Number.isFinite(kg) && kg >= 0);
      for (const h of r.farm?.hivesData || []) assert.ok(h.bees >= 4 && h.bees <= h.capBees);
    }
  }
  const reopened = new BeeGame(new MemoryStore(structuredClone(bee.state)));
  assert.ok(Number.isFinite(reopened.netWorth()));
  assert.equal(reopened.state.village.arrived.length, bee.state.village.arrived.length);
});