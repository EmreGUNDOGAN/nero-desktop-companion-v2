const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const beeSource = fs.readFileSync(path.join(root, 'src/main/bee.js'), 'utf8');
const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
const uiCss = fs.readFileSync(path.join(root, 'src/renderer/bee/ui-v2.css'), 'utf8');
const { Journal } = require('../src/main/journal');

test('6.3.15 approved economy and breeding rules are encoded', () => {
  assert.match(beeSource, /const FOCUS_BOOST = 0\.10/);
  assert.match(beeSource, /const TODO_REWARD_DAILY_LIMIT = 5/);
  assert.match(beeSource, /const WAX_PER_KG = 0\.025/);
  assert.match(beeSource, /anadolu:[^\n]+breedDays: 4/);
  assert.match(beeSource, /kafkas:[^\n]+breedDays: 4/);
  assert.match(beeSource, /italyan:[^\n]+breedDays: 2/);
  assert.match(beeSource, /coins: 300, cup: 'altın'/);
  assert.match(beeSource, /coins: 200, cup: 'gümüş'/);
  assert.match(beeSource, /coins: 100, cup: 'bronz'/);
  assert.match(beeSource, /pct: 15, until: day \+ 2/);
});

test('6.3.15 tournament prompt, smart sell, price effects and warning color hooks exist', () => {
  assert.match(beeSource, /festivalPromptDue\(\)/);
  assert.match(beeSource, /claimFestivalPrompt\(\)/);
  assert.match(beeSource, /reservedOrderKg\(f\)/);
  assert.match(beeSource, /amount === 'orders'/);
  assert.match(beeSource, /marketPriceEffects\(f\)/);
  assert.match(renderer, /data-kg="orders"/);
  assert.match(renderer, /marketEffectTip/);
  assert.match(renderer, /claimFestivalPrompt/);
  assert.match(renderer, /classList\.toggle\('has-warning'/);
  assert.match(uiCss, /#warning-center\.has-warning/);
});

class MemoryStore {
  constructor(value){ this.value = structuredClone(value); }
  get(){ return structuredClone(this.value); }
  set(v){ this.value = structuredClone(v); }
}

test('Nero moodboard stays blank before 23:00 and freezes after finalization', () => {
  const moodStore = new MemoryStore({ days: {} });
  const journal = new Journal({
    moodStore,
    archiveStore: new MemoryStore({ items: [] }),
    jarStore: new MemoryStore({ items: [] })
  });
  const before = new Date(2026, 9, 2, 22, 30, 0);
  journal.recordHappiness(40, before);
  journal.recordHappiness(90, new Date(2026, 9, 2, 22, 50, 0));
  const key = '2026-10';
  const pre = journal.month(key, before).find((d) => d.date === '2026-10-02');
  assert.equal(pre.avg, null);

  assert.equal(journal.finalizeDue(new Date(2026, 9, 2, 23, 0, 0)), true);
  const post = journal.month(key, new Date(2026, 9, 2, 23, 0, 0)).find((d) => d.date === '2026-10-02');
  assert.equal(post.avg, 65);

  journal.recordHappiness(100, new Date(2026, 9, 2, 23, 30, 0));
  const frozen = journal.month(key, new Date(2026, 9, 2, 23, 30, 0)).find((d) => d.date === '2026-10-02');
  assert.equal(frozen.avg, 65);
});