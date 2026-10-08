const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const removed = ["sonbahar-kutuphanesi","amalfi-limonlari","ortancali-kir-evi","kis-tramvayi","doksanlar-kirtasiye","gece-treni","eski-fotografci","lavanta-aksami","kis-bahcesi","gece-masasi","analog-radyo","pastel-mutfak"];

test('6.3.10 experimental theme assets stay rolled back', () => {
  for (const id of removed) {
    assert.equal(fs.existsSync(path.join(root, 'themes', id)), false, id + ' theme directory remains');
    assert.equal(fs.existsSync(path.join(root, 'src/renderer/panel/deco', id)), false, id + ' deco directory remains');
  }
});

test('6.3.10 only in-game Nero bubble is 2.4 seconds and talk animation stops with it', () => {
  const bee = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  assert.match(bee, /bubbleTimer = setTimeout\(\(\) => \{[\s\S]*?classList\.remove\('talk'\)[\s\S]*?\}, 2400\);/);
  const panel = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.js'), 'utf8');
  assert.doesNotMatch(panel, /2400/);
});

test('6.3.10 warning-center exclamation uses approved soft red palette', () => {
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/ui-v2.css'), 'utf8');
  assert.match(css, /#warning-center[^}]*color:\s*#D7655F[^}]*#8B4743[^}]*#B95752/s);
});
