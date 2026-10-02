const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { BeeGame } = require('../src/main/bee');

class MemoryStore {
  constructor(value = null) { this.value = value; }
  get() { return this.value; }
  set(value) { this.value = value; }
  flush() {}
}
const start = () => new BeeGame(new MemoryStore());

test('6.3.5 winter loss can never reduce a player hive below four bees', () => {
  const bee = start();
  const hive = Object.values(bee.state.hives)[0];
  hive.bees = 5; hive.breed = 'anadolu'; hive.syrup = 0; hive.winterShield = 0;
  bee.onNewDay(45);
  assert.equal(hive.bees, 4);
  bee.onNewDay(46); bee.onNewDay(47);
  assert.equal(hive.bees, 4);
});

test('merchant premium follows current approved fifteen percent balance', () => {
  const bee = start();
  const flower = 'yonca';
  bee.state.merchant.active = true;
  bee.state.merchant.wants = flower;
  bee.state.merchant.wantsLeft = 10;
  bee.state.merchant.salesTicketKg = 0;
  bee.state.merchant.stock = [];
  bee.state.storage[flower] = 1;
  const base = bee.price(flower);
  assert.equal(bee.merchantView().wantsPrice, Math.round(base * 1.15 * 10) / 10);
  const before = bee.state.coins;
  const result = bee.merchantSell(1);
  assert.equal(result.ok, true);
  assert.equal(bee.state.coins - before, Math.round(base * 1.15));
});

test('6.3.5 beekeeping UI uses canonical unclothed animated Nero and centered harvest button', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/ui-v2.css'), 'utf8');
  const neroCss = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.css'), 'utf8');
  assert.match(html, /nero-assets\/body\.svg/);
  assert.match(html, /nero-assets\/eyes\.svg/);
  assert.match(html, /nero-assets\/mouth-talk1\.svg/);
  const cornerNero = html.match(/<div class="nero" id="nero">[\s\S]*?<canvas id="snow"/)[0];
  assert.doesNotMatch(cornerNero, /outfit/i);
  assert.match(js, /scheduleNeroBlink/);
  assert.match(neroCss, /nero-breathe/);
  assert.match(css, /\.ui2 \.hexbtn\.big[^}]*margin-top:\s*-9px;[^}]*margin-bottom:\s*-9px/);
  assert.match(css, /#harvest-all[^}]*padding:\s*12px 24px[^}]*align-self:\s*center/);
});

test('6.3.5 map has deterministic four-season ground decor, roof snow and seasonal lighting', () => {
  const root = path.join(__dirname, '..');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  assert.match(js, /function seasonalGroundDetail/);
  assert.match(js, /const SEASON_LIGHTING/);
  assert.match(js, /season === 'kis'/);
  assert.match(js, /season === 'sonbahar'/);
  assert.match(js, /season === 'ilkbahar'/);
  assert.match(js, /snowOnRoofs\(obj\)/);
  assert.match(js, /karo koordinatı/i);
});
