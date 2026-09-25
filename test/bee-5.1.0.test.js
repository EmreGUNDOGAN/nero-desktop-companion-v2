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

test('5.1.0 daily quests create three stable quests and can be claimed', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.ensureQuests();
  assert.equal(bee.state.quests.list.length, 3);
  assert.equal(new Set(bee.state.quests.list.map((q) => q.type)).size, 3);

  const ids = bee.state.quests.list.map((q) => q.id);
  bee.ensureQuests();
  assert.deepEqual(bee.state.quests.list.map((q) => q.id), ids);

  const q = bee.state.quests.list[0];
  q.progress = q.target;
  q.voucher = null;
  const before = bee.state.coins;
  const res = bee.claimQuest(q.id);
  assert.equal(res.ok, true);
  assert.equal(q.claimed, true);
  assert.equal(bee.state.questsDone, 1);
  assert.equal(bee.state.coins, before + q.reward);
});

test('5.1.0 farm and hive names are sanitized and persisted in view', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const hive = Object.values(bee.state.hives)[0];

  assert.equal(bee.renameHive(hive.id, ' <Papatya> Konağı ').ok, true);
  assert.equal(bee.state.hives[hive.id].name, 'Papatya Konağı');

  assert.equal(bee.setFarmName(' <Nero> Bahçesi ').ok, true);
  assert.equal(bee.view().farmName, 'Nero Bahçesi');
});

test('5.1.0 jar label gives known customers a five percent order tip', () => {
  const bee = new BeeGame(new MemoryStore({}));
  bee.state.customers['Ayşe'] = { hearts: 1, deliveries: 2 };
  bee.state.label = { design: 'klasik', color: '#D97A45' };
  bee.state.storage.yonca = 10;
  bee.state.orders.list = [{
    id: 'order-tip-test',
    who: 'Ayşe',
    flower: 'yonca',
    kg: 2,
    reward: 100,
    days: 2,
    status: 'accepted',
    deadline: bee.state.gameMs + 999999
  }];

  const before = bee.state.coins;
  const res = bee.deliverOrder('order-tip-test');
  assert.equal(res.ok, true);
  assert.equal(bee.state.coins, before + 105);
  assert.match(res.msg, /\+5 etiket bahşişi/);
});

test('5.1.0 weather obeys seasonal constraints when loading old saves', () => {
  const summerMs = 15 * 15 * 60 * 1000;
  const bee = new BeeGame(new MemoryStore({ gameMs: summerMs, weather: 'karli' }));
  assert.equal(bee.calendar().season, 'yaz');
  assert.equal(bee.state.weather, 'gunesli');
});

test('5.1.0 view exposes quests, ledger, label and daily statistics', () => {
  const bee = new BeeGame(new MemoryStore({}));
  const v = bee.view();
  assert.equal(Array.isArray(v.quests), true);
  assert.equal(v.quests.length, 3);
  assert.ok(v.ledger && typeof v.ledger === 'object');
  assert.ok(v.labelDesigns && v.labelDesigns.klasik);
  assert.equal(v.labelBonus, 0.05);
  assert.ok(v.today && Number.isFinite(v.today.produced) && Number.isFinite(v.today.earned));
  assert.ok(Array.isArray(v.history));
});

test('5.1.0 main/preload/renderer wiring exposes the new beekeeping tools', () => {
  const root = path.join(__dirname, '..');
  const main = fs.readFileSync(path.join(root, 'src/main/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(root, 'src/preload/bee-preload.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const panel = fs.readFileSync(path.join(root, 'src/renderer/panel/index.html'), 'utf8');

  for (const action of ['claimQuest', 'renameHive', 'setFarmName', 'setLabel']) {
    assert.match(main, new RegExp(action + ':'));
  }
  assert.match(main, /ipcMain\.handle\('bee:photo'/);
  assert.match(main, /ipcMain\.handle\('bee:openPhotos'/);
  assert.match(preload, /photo: \(\) => ipcRenderer\.invoke\('bee:photo'\)/);
  assert.match(preload, /openPhotos: \(\) => ipcRenderer\.invoke\('bee:openPhotos'\)/);

  for (const id of ['quests', 'open-ledger', 'open-stats', 'photo-btn', 'ambient-btn', 'ledger-modal', 'stats-modal']) {
    assert.ok(html.includes(`id="${id}"`), `${id} missing from beekeeping UI`);
  }
  assert.match(renderer, /function nightLevel/);
  assert.match(renderer, /function ambientTick/);
  assert.match(renderer, /async function takePhoto/);

  // 5.0.0'da kararlaştırılan Arıcılık giriş noktası yer değiştirmemeli.
  assert.ok(panel.includes('id="bee-open"'));
  assert.ok(panel.indexOf('id="bee-open"') < panel.indexOf('id="settings-button"'));
});
