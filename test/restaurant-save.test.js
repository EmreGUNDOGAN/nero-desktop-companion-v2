'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const load = name => import('data:text/javascript;base64,' + fs.readFileSync(path.join(__dirname, '../src/renderer/restaurant', name)).toString('base64'));
const storage = () => { const map = new Map(); return { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) }; };
const service = () => ({ value: { version: 1, gold: 60 }, elapsed: null, exportCheckpoint() { return structuredClone(this.value); }, restoreCheckpoint(value) { if (value.version !== 1 || !Number.isFinite(value.gold)) return false; this.value = structuredClone(value); return true; }, resumeTimers(seconds) { this.elapsed = seconds; } });
test('restaurant saves restore progress, paused time and a recoverable backup', async () => {
  const { connectGameSave } = await load('game-save.js'), data = storage(), first = service();
  const save = connectGameSave(first, { storage: data, now: () => 1000, runtime: () => ({ manualPaused: true }) });
  first.value.gold = 42; assert.equal(save.save(), true);
  first.value.gold = 31; assert.equal(save.save(), true);
  const resumed = service(); connectGameSave(resumed, { storage: data, now: () => 900000 });
  assert.equal(resumed.value.gold, 31); assert.equal(resumed.elapsed, 0);
  data.setItem('ezgis-krab-shack-save-v1', '{broken');
  const recovered = service(), backup = connectGameSave(recovered, { storage: data, now: () => 900000 });
  assert.equal(recovered.value.gold, 42); assert.equal(backup.snapshot().status, 'Yedekten kurtarıldı');
});
test('stale restaurant windows cannot overwrite newer saves and invalid saves remain intact', async () => {
  const { connectGameSave } = await load('game-save.js'), data = storage();
  const first = connectGameSave(service(), { storage: data, now: () => 1000 });
  const stale = connectGameSave(service(), { storage: data, now: () => 1000 });
  assert.equal(first.save(), true); const before = data.getItem('ezgis-krab-shack-save-v1');
  assert.equal(stale.save(), false); assert.equal(data.getItem('ezgis-krab-shack-save-v1'), before);
  const corrupt = storage(); corrupt.setItem('ezgis-krab-shack-save-v1', 'invalid');
  assert.equal(connectGameSave(service(), { storage: corrupt }).save(), false);
  assert.equal(corrupt.getItem('ezgis-krab-shack-save-v1'), 'invalid');
});
test('restaurant offline timer respects remaining background budget and manual pause', async () => {
  const { connectGameSave } = await load('game-save.js'), data = storage();
  connectGameSave(service(), { storage: data, now: () => 1000, runtime: () => ({ hidden: true, backgroundUsed: 3590 }) }).save();
  const resumed = service(); connectGameSave(resumed, { storage: data, now: () => 9999999 }); assert.equal(resumed.elapsed, 10);
  const { ActivityClock } = await load('activity-clock.js'), clock = new ActivityClock(0);
  assert.equal(clock.setHidden(true, 1000), 1); assert.equal(clock.advance(4001000), 3600);
  assert.equal(clock.advance(5001000), 0); clock.setHidden(false, 5001000);
  assert.equal(clock.advance(5002000), 1); clock.setPaused(true, 5002000);
  assert.equal(clock.advance(6002000), 0); clock.setPaused(false, 6002000);
  assert.equal(clock.advance(6003000), 1);
});
