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

  for (const channel of ['bee:open', 'bee:export', 'bee:import']) {
    assert.ok(preload.includes(`'${channel}'`), `${channel} panel preload izin listesinde yok`);
  }

  assert.ok(panel.indexOf('id="bee-open"') < panel.indexOf('id="settings-button"'));
  assert.ok(panel.includes('id="bee-export"'));
  assert.ok(panel.includes('id="bee-import"'));

  const cats = ['bee_hive_full', 'bee_order_due', 'bee_winter', 'bee_overtaken', 'bee_sick'];
  for (const cat of cats) assert.deepEqual(runtime[cat], master[cat]);
  for (const placeholder of ['hive', 'who', 'rival']) {
    assert.ok(manifest.rules.allowed_placeholders.includes(placeholder));
  }
});
