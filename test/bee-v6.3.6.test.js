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
const root = path.join(__dirname, '..');

test('6.3.6 season icon has a single SVG owner and autumn cannot flicker emoji/SVG', () => {
  const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const ui2 = fs.readFileSync(path.join(root, 'src/renderer/bee/ui-v2.js'), 'utf8');
  assert.doesNotMatch(renderer, /\$\('season-ico'\)\.textContent/);
  assert.match(ui2, /if \(si\.dataset\.ico !== want\)/);
  assert.match(ui2, /si\.innerHTML = icon\(want\)/);
});

test('6.3.6 beekeeping Nero stops talking exactly when its bubble hides', () => {
  const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  assert.match(renderer, /b\.hidden = true;\s*\$\('nero'\)\.classList\.remove\('talk'\)/s);
});

test('6.3.6 warning exclamation and harvest button use approved soft palettes', () => {
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/ui-v2.css'), 'utf8');
  assert.match(css, /#warning-center[^}]*color:\s*#D7655F[^}]*#8B4743[^}]*#B95752/s);
  assert.match(css, /\.hexbtn\.big[^}]*#A8C88A[^}]*#789B60/s);
  assert.match(css, /\.hexbtn\.big:hover[^}]*#96BA76/s);
});

test('6.3.6 production effects expose the real live multipliers', () => {
  const bee = new BeeGame(new MemoryStore());
  const hive = Object.values(bee.state.hives)[0];
  hive.breed = 'anadolu';
  hive.sick = true;
  bee.state.weather = 'yagmurlu';
  bee.state.focusBoostUntil = Date.now() + 60000;
  hive.vitaminUntilDay = bee.dayIndex() + 2;
  const effects = bee.hiveProductionEffects(hive.id);
  const byLabel = Object.fromEntries(effects.map((e) => [e.label, e]));
  assert.equal(byLabel['🌧️ Yağmurlu hava'].mult, 0.6);
  assert.equal(byLabel['🐝 Anadolu arısı'].mult, 1.1);
  assert.equal(byLabel['🤒 Hasta kovan'].mult, 0.7);
  assert.equal(byLabel['🎯 Odak bonusu'].mult, 1.25);
  assert.equal(byLabel['💊 Arı vitamini'].mult, 1.15);
  const viewHive = bee.view().hives[hive.id];
  assert.ok(Array.isArray(viewHive.productionEffects));
  assert.ok(viewHive.productionEffects.length >= 5);
});

test('6.3.6 winter advance notice is persistent, once-per-winter and respects preferences', () => {
  const store = new MemoryStore();
  let bee = new BeeGame(store);
  const hive = Object.values(bee.state.hives)[0];
  hive.syrup = 0;
  // Autumn day 15 = absolute day index 44.
  bee.state.gameMs = 44 * 15 * 60 * 1000;
  let n = bee.claimWinterAdvanceNotice();
  assert.equal(n.count, 1);
  assert.equal(n.key, '1:kis');
  assert.equal(bee.claimWinterAdvanceNotice(), null);

  bee = new BeeGame(store);
  assert.equal(bee.claimWinterAdvanceNotice(), null);

  // Next year's autumn day 15.
  bee.state.gameMs = 104 * 15 * 60 * 1000;
  n = bee.claimWinterAdvanceNotice();
  assert.equal(n.key, '2:kis');

  bee.state.gameSettings.notify.winter = false;
  bee.state.winterWindowsNoticeKey = null;
  assert.equal(bee.claimWinterAdvanceNotice(), null);
});

test('6.3.6 production hover markup and tooltip palette are present', () => {
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.css'), 'utf8');
  assert.match(html, /class="stat production-stat"[^>]*tabindex="0"/);
  assert.match(html, /id="h-prod-effects"/);
  assert.match(css, /\.prod-effect\.buff[^}]*#E4F1DE/);
  assert.match(css, /\.prod-effect\.debuff[^}]*#F6E1DE/);
});
