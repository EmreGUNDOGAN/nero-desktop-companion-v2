const test = require('node:test');
const assert = require('node:assert/strict');
const { BeeGame } = require('../src/main/bee');

class MemoryStore {
  constructor(value = {}) { this.value = value; }
  get() { return this.value; }
  set(value) { this.value = value; }
  flush() {}
}

test('eski rakip kayıtları çiftliğe taşınır; aynı gün bir kez hesaplanır', () => {
  const store = new MemoryStore();
  const game = new BeeGame(store);
  const old = structuredClone(store.value);
  for (const rival of old.rivals) delete rival.farm;
  delete old.rivalsLastDay;
  const migrated = new BeeGame(new MemoryStore(old));
  assert.ok(migrated.state.rivals.every((r) => r.farm && Number.isFinite(r.farm.coins)));
  migrated.rollRivals(1);
  const state = JSON.stringify(migrated.state.rivals);
  migrated.rollRivals(1);
  assert.equal(JSON.stringify(migrated.state.rivals), state);
  assert.ok(migrated.leaderboard().every((r) => r.me || typeof r.reason === 'string'));
});

test('60 günlük rakip simülasyonu tekrar üretilebilir, net değerleri sonlu kalır', () => {
  const base = structuredClone(new BeeGame(new MemoryStore()).state);
  function run() {
    const game = new BeeGame(new MemoryStore(structuredClone(base)));
    for (let day = 1; day <= 60; day++) game.rollRivals(day);
    return game.state.rivals.map((r) => ({ nw: r.nw, history: r.history, farm: r.farm }));
  }
  assert.deepEqual(run(), run());
  for (const r of run()) {
    assert.equal(r.history.length, 60);
    assert.ok(Number.isFinite(r.nw) && r.nw >= 50);
    assert.ok(r.farm.bees >= 4 && r.farm.hives >= 1 && r.farm.coins >= 0);
  }
});
