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

test('5.5.0 odak bonusu gerçek gün başına en fazla 4 saat kazanılır', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.focusBoostUntil = 0;
  bee.state.focusDaily = { day: bee.todayKey(), earnedMs: 0 };

  for (let i = 0; i < 4; i++) assert.equal(bee.focusCompleted(25), true);
  assert.equal(bee.state.focusDaily.earnedMs, 4 * 60 * 60 * 1000);
  assert.equal(bee.focusCompleted(25), false);
  assert.equal(bee.state.focusDaily.earnedMs, 4 * 60 * 60 * 1000);

  const effects = bee.effectsView();
  assert.equal(effects.focus.dailyLimitMs, 4 * 60 * 60 * 1000);
  assert.equal(effects.focus.earnedTodayMs, 4 * 60 * 60 * 1000);
});

test('5.5.0 eski güne ait odak kazanımı sıfırlanır ama yeni gün yeniden kazanabilir', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.focusBoostUntil = 0;
  bee.state.focusDaily = { day: '2000-01-01', earnedMs: 4 * 60 * 60 * 1000 };
  assert.equal(bee.focusCompleted(25), true);
  assert.equal(bee.state.focusDaily.day, bee.todayKey());
  assert.ok(bee.state.focusDaily.earnedMs >= 60 * 60 * 1000);
});

test('5.5.0 aynı köylünün aynı anda ikinci normal siparişi oluşmaz', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.orders.list = [];
  const first = bee.makeOrder();
  assert.ok(first);
  bee.state.orders.list.push(first);
  const second = bee.makeOrder();
  assert.ok(second);
  assert.notEqual(second.who, first.who);
});

test('5.5.0 kalp başına sipariş ödeme bonusu yüzde 2dir', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.orders.list = [];
  const originalRandom = Math.random;
  Math.random = () => 0.5;
  try {
    const base = bee.makeOrder();
    assert.ok(base);
    bee.state.customers[base.who] = { delivered: 2, hearts: 1 };
    const withHeart = bee.makeOrder();
    assert.equal(withHeart.who, base.who);
    const ratio = withHeart.reward / base.reward;
    assert.ok(ratio > 1.015 && ratio < 1.03, `beklenen yaklaşık 1.02, gelen ${ratio}`);
  } finally {
    Math.random = originalRandom;
  }
});

test('5.5.0 günlük görev değişiminde 2 ücretsiz ve yalnız 1 ücretli hak vardır', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.coins = 10000;
  bee.state.quests = null;
  bee.ensureQuests();
  assert.equal(bee.state.quests.list.length, 3);
  assert.equal(bee.state.quests.refreshFree, 2);
  assert.equal(bee.state.quests.paidUsed, false);

  let r = bee.refreshQuest(bee.state.quests.list[0].id);
  assert.equal(r.ok, true);
  assert.equal(bee.state.quests.refreshFree, 1);

  r = bee.refreshQuest(bee.state.quests.list[0].id);
  assert.equal(r.ok, true);
  assert.equal(bee.state.quests.refreshFree, 0);

  const before = bee.state.coins;
  r = bee.refreshQuest(bee.state.quests.list[0].id);
  assert.equal(r.ok, true);
  assert.equal(bee.state.quests.paidUsed, true);
  assert.equal(bee.state.coins, before - 100);

  r = bee.refreshQuest(bee.state.quests.list[0].id);
  assert.equal(r.ok, false);
  assert.match(r.msg, /hakkın bitti/i);
});

test('5.5.0 günlük görev kataloğu 40 tür içerir', () => {
  const src = fs.readFileSync(path.join(__dirname, '../src/main/bee.js'), 'utf8');
  const m = src.match(/const QUEST_TYPES = \[([\s\S]*?)\];/);
  assert.ok(m);
  const types = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  assert.equal(types.length, 40);
  assert.equal(new Set(types).size, 40);
});

test('5.5.0 Seyyah Yakup kataloğu 38 üründür ve dekor içermez', () => {
  const src = fs.readFileSync(path.join(__dirname, '../src/main/bee.js'), 'utf8');
  const block = src.slice(src.indexOf('const MERCHANT_ITEMS = {'), src.indexOf('// Köylü hikâyeleri'));
  const ids = [...block.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\{/gm)].map((x) => x[1]);
  assert.equal(ids.length, 38);
  assert.equal(new Set(ids).size, 38);
  assert.ok(!/dekor|çit|bank|fener|çeşme/i.test(block));
});

test('5.5.0 Stok Değişim Jetonu iki ürünlük Yakup kotasını tüketmez', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.coins = 10000;
  bee.state.merchant = {
    nextDay: 999, active: true, until: bee.dayIndex() + 2, slot: null, sandik: 0,
    stock: [
      { id: 'mum', sold: false },
      { id: 'pazarTahmin', sold: false },
      { id: 'seyyahFis', sold: false },
      { id: 'stokDegisim', sold: false }
    ],
    bought: [], wants: 'yonca', wantsLeft: 10, salesTicketKg: 0
  };

  assert.equal(bee.merchantBuy('mum', null).ok, true);
  assert.equal(bee.merchantBuy('pazarTahmin', null).ok, true);
  assert.equal(bee.state.merchant.bought.length, 2);
  const reroll = bee.merchantBuy('stokDegisim', 'seyyahFis');
  assert.equal(reroll.ok, true);
  assert.equal(bee.state.merchant.bought.length, 2);
});

test('5.5.0 Pazar Mührü yalnız bir sonraki satış işleminde kullanılır', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.storage.yonca = 20;
  bee.state.merchantEffects.marketSealKg = 10;
  const before = bee.state.coins;
  const first = bee.sellHoney('yonca', 1);
  assert.equal(first.ok, true);
  assert.equal(bee.state.merchantEffects.marketSealKg, 0);
  const afterFirst = bee.state.coins;
  const second = bee.sellHoney('yonca', 1);
  assert.equal(second.ok, true);
  assert.ok(afterFirst > before);
  assert.ok(bee.state.coins > afterFirst);
});

test('5.5.0 geri dönüş özeti 20 dakikadan önce açılmaz', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.markAway();
  bee.state.away.at = Date.now() - 19 * 60 * 1000;
  assert.equal(bee.takeAwaySummary(), null);

  bee.markAway();
  bee.state.away.at = Date.now() - 21 * 60 * 1000;
  assert.ok(bee.takeAwaySummary());
});
