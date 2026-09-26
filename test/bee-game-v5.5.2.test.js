const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { BeeGame } = require('../src/main/bee');

class MemoryStore {
  constructor(value = {}) { this.value = value; }
  get() { return this.value; }
  set(value) { this.value = value; }
  flush() {}
}

test('5.5.2 standart şurup 15 kg verir ve taban fiyat 45 jetondur', () => {
  const src = fs.readFileSync(path.join(__dirname, '../src/main/bee.js'), 'utf8');
  assert.match(src, /const SYRUP_COST = 45;/);
  assert.match(src, /const SYRUP_KG = 15;/);

  const bee = new BeeGame(new MemoryStore({}));
  const hive = Object.values(bee.state.hives)[0];
  bee.state.coins = 1000;
  const beforeSyrup = hive.syrup;
  const beforeCoins = bee.state.coins;
  const cost = bee.syrupCost();

  const res = bee.giveSyrup(hive.id);
  assert.equal(res.ok, true);
  assert.equal(hive.syrup, beforeSyrup + 15);
  assert.equal(bee.state.coins, beforeCoins - cost);
  assert.equal(bee.view().syrupKg, 15);
});

test('5.5.2 erzak gün sayısı arı sayısından bağımsızdır ve yalıtımda yarıya iner', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const hive = Object.values(bee.state.hives)[0];
  hive.syrup = 15;

  hive.bees = 4;
  assert.equal(bee.feedDays(hive, 45), 15);
  hive.bees = 20;
  assert.equal(bee.feedDays(hive, 45), 15);

  hive.insulationFromDay = 45;
  hive.insulationUntilDay = 60;
  assert.equal(bee.winterFeedNeed(hive, 45), 0.5);
  assert.equal(bee.feedDays(hive, 45), 30);
});

test('5.5.2 eksik günlük erzak tamamen tüketilir ve beslenmiş sayılmaz', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const hive = Object.values(bee.state.hives)[0];
  bee.state.nextLetterDay = 9999;
  bee.state.merchant.nextDay = 9999;
  hive.syrup = 0.4;
  hive.fedDay = null;

  bee.onNewDay(45);

  assert.equal(hive.syrup, 0);
  assert.equal(hive.fedDay, null);
});

test('5.5.2 üç saat görünmeyen Arıcılıkta takvim ve üretim tamamen donar', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const now = Date.now();
  bee.state.speed = 4;
  bee.state.lastSeenAt = now - 3 * 60 * 60 * 1000 - 1000;
  bee.state.gameMs = 123456;
  bee.lastDay = bee.dayIndex();
  bee.lastTickAt = now - 1000;
  const produced = bee.state.counters.produced;

  const changed = bee.tick(now, 2);

  assert.equal(changed, false);
  assert.equal(bee.state.gameMs, 123456);
  assert.equal(bee.state.counters.produced, produced);
  assert.ok(bee.state.pauseStartedAt);
});

test('5.5.2 tam duraklama sonrası normal sipariş sayacı kaldığı yerden sürer', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const now = Date.now();
  bee.state.pauseStartedAt = now - 60 * 60 * 1000;
  bee.state.lastSeenAt = now - 4 * 60 * 60 * 1000;
  bee.state.orders.nextAtReal = bee.state.pauseStartedAt + 2 * 60 * 1000;

  bee.markSeen();

  const remaining = bee.state.orders.nextAtReal - Date.now();
  assert.ok(remaining > 90 * 1000 && remaining <= 2 * 60 * 1000 + 1000);
  assert.equal(bee.state.pauseStartedAt, null);
});

test('5.5.2 Yakup Kışlık Şurup Fıçısı 105 jeton ve 45 kgdır', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const hive = Object.values(bee.state.hives)[0];
  bee.state.coins = 1000;
  bee.state.merchant = {
    nextDay: 999, active: true, until: bee.dayIndex() + 2, slot: null, sandik: 0,
    stock: [{ id: 'kislikSurup', sold: false }],
    bought: [], wants: 'yonca', wantsLeft: 10, salesTicketKg: 0
  };

  assert.equal(bee.merchantPrice('kislikSurup', hive.id), 105);
  assert.equal(bee.merchantQuote('kislikSurup', hive.id).price, 105);
  const before = hive.syrup;
  const res = bee.merchantBuy('kislikSurup', hive.id);
  assert.equal(res.ok, true);
  assert.equal(hive.syrup, before + 45);
  assert.equal(bee.state.coins, 895);
});

test('5.5.2 50 kg toplam üretimde Çiçekçi Ezgi açılır ve hediyesi bir kez alınır', () => {
  const bee = new BeeGame(new MemoryStore({}));
  assert.equal(bee.state.village.arrived.includes(7), false);

  bee.state.counters.produced = 50;
  bee.checkVillage(false);

  assert.equal(bee.state.village.arrived.includes(7), true);
  const ezgi = bee.villageView().residents.find((r) => r.n === 7);
  assert.equal(ezgi.name, 'Çiçekçi Ezgi');
  assert.equal(ezgi.owner, 'Ezgi');
  assert.equal(bee.state.ezgiWelcomePending, true);

  const choice = bee.ezgiChoice();
  const before = bee.state.vouchers[choice] || 0;
  const gift = bee.claimEzgiWelcome();
  assert.equal(gift.ok, true);
  assert.equal(bee.state.vouchers[choice], before + 1);
  assert.equal(bee.claimEzgiWelcome().ok, false);
});

test('5.5.2 Ezgi’nin Seçimi mevcut tohum indirimine ek yüzde 15 uygular', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.counters.produced = 50;
  bee.checkVillage(true);
  const flower = bee.ezgiChoice();
  const def = require('../src/main/bee').FLOWERS[flower];
  const normalWithShop = Math.round(def.seed * 0.9);
  assert.equal(bee.seedCost(flower), Math.max(1, Math.round(def.seed * 0.9 * 0.85)));
  assert.ok(bee.seedCost(flower) <= normalWithShop);
});

test('5.5.2 ileri ses ayarları tek tek saklanabilir', () => {
  const bee = new BeeGame(new MemoryStore({}));
  assert.equal(bee.setGameSetting('audio.rain', false).ok, true);
  assert.equal(bee.setGameSetting('audio.notifyMerchant', false).ok, true);
  assert.equal(bee.setGameSetting('notificationSound', false).ok, true);
  assert.equal(bee.state.gameSettings.audio.rain, false);
  assert.equal(bee.state.gameSettings.audio.notifyMerchant, false);
  assert.equal(bee.state.gameSettings.notificationSound, false);
});

test('5.5.2 görev ikonu, ileri ses ayarları ve mevcut stil kabuğu rendererda bulunur', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  assert.ok(html.includes('id="quests-icon"'));
  assert.ok(html.includes('id="gs-notification-sound"'));
  assert.ok(html.includes('id="gs-advanced-audio"'));
  assert.ok(html.includes('id="gs-audio"'));
  assert.match(js, /Satın al ·/);
  assert.match(js, /Ezgi’nin Seçimi/);
  assert.match(js, /🌾 Erzak:/);
});
