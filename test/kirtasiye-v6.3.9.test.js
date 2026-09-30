const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const deco = path.join(root, 'src/renderer/panel/deco/doksanlar-kirtasiye');
const css = fs.readFileSync(path.join(root, 'src/renderer/panel/skins.css'), 'utf8');
const section = css.slice(css.indexOf("6.3.9 — 90'LAR KIRTASİYE"));
const pngs = ["baslik.png","bg-bugun.png","bg-notlar.png","bg-isler.png","bg-sayac.png","bg-rozetler.png","asset-pencilcase.png","asset-pens.png","asset-washi.png","asset-binder.png","asset-clip.png","asset-flower.png","asset-star.png","asset-sticky.png","asset-notepad.png","asset-torn-note.png","note-card-pink.png","note-card-mint.png","note-card-lilac.png","note-card-blue.png","note-card-yellow.png"];

test('6.3.9 ships the approved 90lar Kirtasiye PNG pack', () => {
  for (const name of pngs) {
    const data = fs.readFileSync(path.join(deco, name));
    assert.equal(data[0], 0x89, name);
    assert.equal(data.subarray(1,4).toString('ascii'), 'PNG', name);
  }
});
test('6.3.9 wires a PNG background to every core page', () => {
  for (const name of ['bg-bugun.png','bg-notlar.png','bg-isler.png','bg-sayac.png','bg-rozetler.png']) assert.ok(section.includes(name), name);
});
test('6.3.9 Kirtasiye CSS no longer references SVG theme art', () => {
  assert.doesNotMatch(section, /deco\/doksanlar-kirtasiye\/[^)"']+\.svg/);
  assert.match(section, /baslik\.png/);
  assert.match(section, /asset-pencilcase\.png/);
});
test('6.3.9 preserves classic badges and resize grips', () => {
  const panel = fs.readFileSync(path.join(root,'src/renderer/panel/panel.js'),'utf8');
  assert.match(panel, /icon\.className = 'badge-icon';\s*icon\.textContent = a\.unlockedAt \? a\.icon : '\?';/s);
  assert.match(section, /\.badge-icon \{ background:#F0A9C0/);
  assert.match(section, /\.grip \{\s*position:absolute !important;/s);
});
