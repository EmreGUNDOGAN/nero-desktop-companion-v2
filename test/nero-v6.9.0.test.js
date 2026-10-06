'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const { BeeGame } = require('../src/main/bee');
const todoTree = require('../src/main/todo-tree');
class Store { constructor(value = null) { this.value = value; } get() { return this.value; } set(v) { this.value = JSON.parse(JSON.stringify(v)); } flush() {} }
const game = () => new BeeGame(new Store());
const every = 300000;
test('6.9.0 syrup adds no player or AI capital, buying only spends cash', () => {
  const g = game(), hive = Object.values(g.state.hives)[0];
  const before = g.competitiveNetWorth(); hive.syrup += 150;
  assert.equal(g.competitiveNetWorth(), before);
  g.state.coins = 10000; const wealth = g.competitiveNetWorth(); const cost = g.syrupCost();
  assert.equal(g.giveSyrup(hive.id).ok, true); assert.equal(g.competitiveNetWorth(), wealth - cost);
  for (const rival of g.state.rivals) {
    const farm = rival.farm; const nw = g.rivalNetWorth(farm, true);
    for (const h of farm.hivesData) h.syrup += 150;
    assert.equal(g.rivalNetWorth(farm, true), nw);
    farm.coins -= 45; farm.hivesData[0].syrup += 15;
    assert.equal(g.rivalNetWorth(farm, true), nw - 45);
  }
});
test('6.9.0 independent order streams: full honey list permits product arrivals, capped at 10', () => {
  const g = game(); let id = 0;
  g.state.orders.list = Array.from({ length: g.orderMax() }, () => ({ id: `h${id++}`, kind: 'honey', status: 'open' }));
  g.makeOrder = kind => ({ id: `p${id++}`, kind, status: 'open', who: 'Test', productId: 'honeyTart', count: 1 });
  g.state.orderClockMs = 0; g.state.orders.nextAtClock = every; g.state.orders.nextProductAtClock = every;
  g.state.orderClockMs = every - 1; g.processOrders(); assert.equal(g.ordersView().list.filter(o => o.kind === 'product').length, 0);
  g.state.orderClockMs = every; g.processOrders(); assert.equal(g.state.orders.list.filter(o => o.kind === 'product').length, 1);
  g.state.orderClockMs = 30 * every; g.processOrders();
  assert.equal(g.state.orders.list.filter(o => o.kind === 'product').length, 10);
  assert.equal(g.state.orders.list.filter(o => o.kind !== 'product').length, g.orderMax());
  assert.equal(g.ordersView().productNextInMs, null);
  const products = g.state.orders.list.filter(o => o.kind === 'product');
  g.state.orders.list = g.state.orders.list.filter(o => o.id !== products[0].id);
  g.state.orderClockMs += every - 1; g.processOrders(); assert.equal(g.state.orders.list.filter(o => o.kind === 'product').length, 9);
  g.state.orderClockMs += 1; g.processOrders(); assert.equal(g.state.orders.list.filter(o => o.kind === 'product').length, 10);
});
test('6.9.0 paused and accelerated games receive one product per five real minutes', () => {
  for (const speed of [0, 1, 4]) {
    const g = game(), now = Date.now();
    g.state.speed = speed; g.state.orders.list = []; g.state.orderClockMs = 0;
    g.state.orders.nextAtClock = every; g.state.orders.nextProductAtClock = every; g.lastTickAt = now;
    g.makeOrder = kind => kind === 'product' ? ({ id: 'p', kind, productId: 'honeyTart', count: 1, status: 'open', who: 'Test' }) : null;
    g.tick(now + every - 1); assert.equal(g.state.orders.list.length, 0);
    g.tick(now + every); assert.equal(g.state.orders.list.length, 1);
  }
});
test('6.9.0 offline order migration preserves existing orders and catches up product slots', () => {
  const g = game(); g.state.village.arrived = Array.from({ length: 78 }, (_, i) => i + 1);
  g.state.workshop.products.goods.honeyTart = 30;
  g.state.orders.list = [{ id: 'keep', kind: 'product', who: 'Ayşe', productId: 'honeyTart', count: 1, days: 2, status: 'open' }];
  delete g.state.orders.nextProductAtClock;
  g.state.orders.lastWallAt = Date.now() - 60 * every;
  const store = new Store(JSON.parse(JSON.stringify(g.state))), loaded = new BeeGame(store);
  assert.ok(loaded.findOrder('keep')); assert.equal(loaded.state.orders.list.filter(o => o.kind === 'product').length, 10);
  loaded.save(); const again = new BeeGame(store); assert.equal(again.state.orders.list.filter(o => o.kind === 'product').length, 10);
});
test('6.9.0 product market preserves accepted-order reservations and delivery stays in selected stream', () => {
  const g = game(); g.state.workshop.products.goods.honeyTart = 3;
  g.state.storage.yonca = 5; g.state.orders.list = [{ id: 'p', kind: 'product', productId: 'honeyTart', count: 2, who: 'Ayşe', status: 'accepted', reward: 50 }, { id: 'h', kind: 'honey', flower: 'yonca', kg: 2, who: 'Test', status: 'accepted', reward: 50 }];
  assert.equal(g.workshopProductsView().find(p => p.key === 'honeyTart').available, 1);
  assert.equal(g.sellWorkshopProduct('honeyTart', 'all').ok, true); assert.equal(g.workshopProductCount('honeyTart'), 2);
  assert.equal(g.deliverReady('product').ok, true); assert.ok(g.findOrder('h')); assert.equal(g.findOrder('p'), undefined);
});
function tasks(initial) {
  const handlers = new Map(), store = new Store(initial), counters = { reward: 0, done: 0, archive: 0 };
  let id = 0;
  const main = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const fragment = main.slice(main.indexOf("  ipcMain.handle('todos:toggle'"), main.indexOf("  ipcMain.handle('todos:rename'"));
  const helper = main.slice(main.indexOf('  function completeTodo('), main.indexOf("  ipcMain.handle('todos:toggle'"));
  vm.runInNewContext(helper + fragment, {
    ipcMain: { handle: (name, fn) => handlers.set(name, fn) }, todosStore: store, todoTree,
    uid: () => `child${++id}`, Date, String, Array, Number,
    stats: { todoDone: n => counters.done += n, award() {} }, bee: { todoCompleted: () => counters.reward++ }, journal: { archiveDone: () => counters.archive++ },
    sendBee() {}, settings: () => ({ sound: false }), sendTo() {}, charWin: null, commitTodoStopwatch() {}, broadcastState() {},
    dayKey: () => 'today', chance: () => false, reactToInteraction: (_kind, fn) => fn(), say() {}, scheduleRestAfterAllDone() {}, truncate: t => t
  });
  return { store, counters, act: (name, ...args) => handlers.get(`todos:${name}`)(null, ...args) };
}
test('6.9.0 real task handlers persist nested edits, auto complete, reopen and use the existing reward flow once per completion', () => {
  const t = tasks([{ id: 'a', text: 'Boyama defteri', done: false }]);
  t.act('addSubtask', 'a', 'Birinci sayfa'); t.act('addSubtask', 'a', 'İkinci sayfa');
  t.act('toggleSubtask', 'a', 'child1'); assert.equal(t.store.get()[0].done, false);
  t.act('toggleSubtask', 'a', 'child2'); assert.equal(t.store.get()[0].done, true); assert.equal(t.counters.reward, 1); assert.equal(t.counters.done, 1);
  t.act('toggleSubtask', 'a', 'child1'); assert.equal(t.store.get()[0].done, false); assert.equal(t.counters.done, 0);
  t.act('renameSubtask', 'a', 'child1', 'Yeni sayfa'); assert.equal(t.store.get()[0].subtasks[0].text, 'Yeni sayfa');
  t.act('toggleSubtask', 'a', 'child1'); assert.equal(t.store.get()[0].done, true); assert.equal(t.counters.reward, 2); assert.equal(t.counters.archive, 2);
  t.act('renameSubtask', 'a', 'child1', 'Bitti'); assert.equal(t.counters.reward, 2);
  const restored = tasks(JSON.parse(JSON.stringify(t.store.get())));
  restored.act('addSubtask', 'a', 'Üçüncü sayfa'); assert.equal(restored.store.get()[0].done, false);
  restored.act('deleteSubtask', 'a', restored.store.get()[0].subtasks[2].id); assert.equal(restored.store.get()[0].done, true); assert.equal(restored.counters.reward, 1);
});
test('6.9.0 manual parent toggles children, reorder preserves groups and ignores invalid IDs', () => {
  const t = tasks([{ id: 'a', text: 'A', done: false, subtasks: [{ id: 'c', text: 'C', done: false }] }, { id: 'b', text: 'B', done: true }, { id: 'old', text: 'Arşiv', done: true, archivedAt: 1 }]);
  t.act('toggle', 'a'); assert.equal(t.store.get()[0].subtasks[0].done, true);
  t.act('toggle', 'a'); assert.equal(t.store.get()[0].subtasks[0].done, false);
  t.act('reorder', ['b', 'b', 'invalid', 'old', 'a']);
  assert.deepEqual(t.store.get().map(t => t.id), ['b','a','old']); assert.equal(t.store.get()[1].subtasks[0].id, 'c');
  assert.equal(todoTree.parentDone({ done: false }), false); assert.equal(todoTree.parentDone({ done: false, subtasks: [] }), false);
});
test('6.9.0 Radyo Akşamı loads actual character and complete wardrobe', () => {
  const { ThemeManager } = require('../src/main/themes');
  const manager = new ThemeManager({ builtinDir: path.join(__dirname, '../themes'), userDir: path.join(__dirname, 'no-user-themes') });
  const listed = manager.scan(); assert.equal(listed.find(t => t.id === 'radyo-aksami').broken, false);
  const radio = manager.get('radyo-aksami').manifest, base = manager.get('default').manifest;
  assert.deepEqual(radio.layers, base.layers); assert.deepEqual(radio.wardrobe, base.wardrobe);
  assert.equal(radio.ui.skin, 'radyo-aksami');
});
test('6.9.0 focus audio plays once, replaces active clip and respects sound preference', async () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/renderer/character/character.js'), 'utf8');
  const a = source.indexOf('  let focusAudio = null;'), b = source.indexOf("  api.on('sound'", a);
  const clips = [], settings = { sound: true };
  class Audio { constructor(src) { this.src = src; clips.push(this); } play() { this.plays = (this.plays || 0) + 1; return Promise.resolve(); } pause() { this.paused = true; } }
  const context = vm.createContext({ settings, Audio, console }); vm.runInContext(source.slice(a, b), context);
  vm.runInContext("playFocusAudio('focus-done')", context); assert.equal(clips[0].loop, false); assert.equal(clips[0].plays, 1); assert.match(clips[0].src, /focus-complete/);
  vm.runInContext("playFocusAudio('focus-cancel')", context); assert.equal(clips[0].paused, true); assert.equal(clips[1].plays, 1); assert.match(clips[1].src, /focus-stop/);
  settings.sound = false; vm.runInContext("playFocusAudio('focus-done')", context); assert.equal(clips.length, 2);
  for (const name of ['focus-complete','focus-stop']) assert.ok(fs.statSync(path.join(__dirname, `../src/renderer/sounds/${name}.mp3`)).size > 1024);
});
