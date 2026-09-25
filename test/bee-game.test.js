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

test('beekeeping focus and todo rewards follow Nero integration rules', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const coinsBefore = bee.state.coins;
  const now = Date.now();

  assert.equal(bee.focusCompleted(9), null);
  assert.equal(bee.focusCompleted(25), true);
  assert.ok(bee.state.focusBoostUntil - now >= 59 * 60 * 1000);

  bee.todoCompleted();
  assert.equal(bee.state.coins, coinsBefore + 10);

  const messages = bee.drainEvents().map((e) => e.msg);
  assert.ok(messages.some((m) => /25 dakika odaklandın/.test(m)));
  assert.ok(messages.some((m) => /\+10/.test(m)));
});

test('desktop beekeeping alerts are emitted once per unchanged condition', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const hive = Object.values(bee.state.hives)[0];
  hive.honey = { yonca: hive.capKg };

  const first = bee.pendingAlerts().filter((a) => a.kind === 'bee_hive_full');
  const second = bee.pendingAlerts().filter((a) => a.kind === 'bee_hive_full');

  assert.equal(first.length, 1);
  assert.equal(first[0].vars.hive, hive.name);
  assert.equal(second.length, 0);
});

test('Nero 5.0.0 contains the complete beekeeping integration wiring', () => {
  const root = path.join(__dirname, '..');
  const main = fs.readFileSync(path.join(root, 'src/main/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(root, 'src/preload/preload.js'), 'utf8');
  const panel = fs.readFileSync(path.join(root, 'src/renderer/panel/index.html'), 'utf8');
  const master = JSON.parse(fs.readFileSync(path.join(root, 'src/data/dialogue.master.tr.json'), 'utf8'));
  const runtime = JSON.parse(fs.readFileSync(path.join(root, 'src/data/dialogue.tr.json'), 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/data/dialogue-master.manifest.json'), 'utf8'));

  assert.equal((main.match(/bee\.focusCompleted\(minutes\)/g) || []).length, 1);
  assert.equal((main.match(/bee\.todoCompleted\(\)/g) || []).length, 1);
  assert.equal((main.match(/bee\.pendingAlerts\(\)/g) || []).length, 1);
  assert.match(main, /async function exportBee\(/);
  assert.match(main, /async function importBee\(/);
  assert.match(main, /Arıcılık oyunu/);

  for (const channel of ['bee:open', 'bee:export', 'bee:import', 'bee:reset']) {
    assert.ok(preload.includes(`'${channel}'`), `${channel} panel preload izin listesinde yok`);
  }

  assert.ok(panel.indexOf('id="bee-open"') < panel.indexOf('id="settings-button"'));
  // 5.5.0: oyunla ilgili bütün ayarlar oyunun içindeki ⚙️ Ayarlar'da
  const beeHtml = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  assert.ok(beeHtml.includes('id="gs-export"'));
  assert.ok(beeHtml.includes('id="gs-import"'));
  assert.ok(!panel.includes('id="bee-export"'), 'arıcılık kaydı Nero panelinde kalmamalı');

  const cats = ['bee_hive_full', 'bee_order_due', 'bee_winter', 'bee_overtaken', 'bee_sick'];
  for (const cat of cats) assert.deepEqual(runtime[cat], master[cat]);
  for (const placeholder of ['hive', 'who', 'rival']) {
    assert.ok(manifest.rules.allowed_placeholders.includes(placeholder));
  }
});


test('beekeeping calendar uses a 15-day game month/season period', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.gameMs = 14 * 15 * 60 * 1000;
  assert.equal(bee.calendar().day, 15);
  assert.equal(bee.calendar().daysPerMonth, 15);
  bee.state.gameMs = 15 * 15 * 60 * 1000;
  assert.equal(bee.calendar().day, 1);
  assert.equal(bee.calendar().season, 'yaz');
  assert.equal(bee.calendar().yearDays, 60);
});

test('beekeeping background simulation caps selected 4x speed at 2x', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.speed = 4;
  bee.state.lastSeenAt = Date.now();
  bee.state.gameMs = 0;
  bee.lastDay = 0;
  bee.lastTickAt = 1000;
  bee.tick(2000, 2);
  assert.equal(bee.state.gameMs, 2000);

  bee.lastTickAt = 2000;
  bee.tick(3000, null);
  assert.equal(bee.state.gameMs, 6000);
});

test('beekeeping reset is exposed in the in-game settings with a backup-first flow', () => {
  const root = path.join(__dirname, '..');
  const main = fs.readFileSync(path.join(root, 'src/main/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(root, 'src/preload/preload.js'), 'utf8');
  const panel = fs.readFileSync(path.join(root, 'src/renderer/panel/index.html'), 'utf8');

  assert.match(main, /async function resetBee\(/);
  assert.match(main, /nero-aricilik-sifirlama-oncesi-/);
  assert.match(main, /beeStore\.set\(freshState\(\)\)/);
  assert.ok(preload.includes("'bee:reset'"));
  const beePreload = fs.readFileSync(path.join(root, 'src/preload/bee-preload.js'), 'utf8');
  const beeHtml = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  assert.ok(beePreload.includes("'bee:reset'"));
  assert.ok(beeHtml.includes('id="gs-reset"'));
  assert.ok(!panel.includes('id="bee-reset"'));
});


test('5.4.2 arı fiyatı satın alma sayacından değil arı sırasından hesaplanır', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const hive = Object.values(bee.state.hives)[0];
  assert.equal(hive.bees, 6);
  assert.equal(bee.beePrice(hive), 34); // 7. arı
  assert.equal(bee.beeNumberPrice(8), 41);
  assert.equal(bee.beeNumberPrice(20), 125);
  assert.equal(Array.from({ length: 14 }, (_, i) => bee.beeNumberPrice(7 + i)).reduce((a, b) => a + b, 0), 1113);

  hive.bees = 7;
  hive.beesBought = 99; // eski sayaç artık fiyatı etkilememeli
  assert.equal(bee.beePrice(hive), 41);
  assert.equal(bee.beeSellPrice(hive), 17);
  hive.bees = 6; // ölüm sonrası fiyat geri düşer
  assert.equal(bee.beePrice(hive), 34);

  hive.bees = 4; // yeni kovanın ilk iki sabit sırası da geriye doğru aynı +7 dizisini sürdürür
  assert.equal(bee.beePrice(hive), 20);
  hive.bees = 5;
  assert.equal(bee.beePrice(hive), 27);
});

test('5.4.2 hastalık kaybı vaka başına üçte birle sınırlıdır ve 4 arı tabanı vardır', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const hive = Object.values(bee.state.hives)[0];
  hive.bees = 8;
  hive.sick = true;
  hive.sickSince = 0;
  hive.sickStartBees = 8;
  hive.sickDeaths = 0;
  hive.immuneUntil = 0;

  assert.equal(bee.sicknessDeathLimit(hive), 3);
  bee.onNewDay(1); // 8 -> 7
  bee.onNewDay(3); // 7 -> 6
  bee.onNewDay(5); // 6 -> 5, üçüncü ölüm ve iyileşme
  assert.equal(hive.bees, 5);
  assert.equal(hive.sick, false);
  assert.equal(hive.immuneUntil, 65);

  hive.bees = 5;
  hive.sick = true;
  hive.sickSince = 10;
  hive.sickStartBees = 5;
  hive.sickDeaths = 0;
  hive.immuneUntil = 0;
  assert.equal(bee.sicknessDeathLimit(hive), 1); // 4 arı tabanı nedeniyle bu vakada yalnız 1 arı kaybedilebilir
  bee.onNewDay(11); // 5 -> 4 ve güvenlik tabanında hemen iyileşir
  assert.equal(hive.bees, 4);
  assert.equal(hive.sick, false);
  assert.equal(hive.immuneUntil, 71);
});

test('5.4.2 siparişleri gerçek zamanda 5 dakikada gelir ve dönüşte en fazla 3 birikir', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.orders.list = [];
  bee.state.orders.nextAtReal = Date.now() - 17 * 60 * 1000;
  bee.processOrders();
  const normal = bee.state.orders.list.filter((x) => !x.special);
  assert.equal(normal.length, 3);
  assert.ok(bee.state.orders.nextAtReal > Date.now() - 5 * 60 * 1000);
});

test('5.4.2 depo kademeleri 10.000 kg kapasiteye kadar devam eder', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const expected = [
    [100, 340], [200, 900], [400, 2250], [800, 4000], [1500, 7500],
    [2500, 12000], [4000, 20000], [6000, 30000], [10000, 50000]
  ];
  for (const [cap, cost] of expected) {
    const next = bee.nextStorage();
    assert.deepEqual(next, { cap, cost });
    bee.state.storageBaseCap = cap;
    bee.state.storageCap = cap;
  }
  assert.equal(bee.nextStorage(), null);
});

test('5.4.2 Etkilerim görünümü odak bonusunu üstte ve kaynaklı etkileri listede döndürür', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const hive = Object.values(bee.state.hives)[0];
  bee.state.focusBoostUntil = Date.now() + 30 * 60 * 1000;
  bee.state.stories.hasan = { step: 2, done: true };
  hive.boostUntilDay = bee.dayIndex() + 1;
  hive.milkDays = 2;
  hive.immuneUntil = bee.dayIndex() + 60;
  const effects = bee.effectsView();
  assert.equal(effects.focus.active, true);
  assert.equal(effects.focus.title, 'Odak Bonusu');
  assert.ok(effects.list.some((x) => x.id === 'story:hasan'));
  assert.ok(effects.list.some((x) => x.icon === 'building'));
  assert.ok(effects.list.some((x) => x.icon === 'syrup'));
  assert.ok(effects.list.some((x) => x.icon === 'milk'));
  assert.ok(effects.list.some((x) => x.icon === 'immunity'));
});
