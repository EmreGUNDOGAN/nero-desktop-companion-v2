const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');

test('6.3.12 wide settings grid cannot shrink and clip card contents', () => {
  const wide = css.match(/@container \(min-width: 600px\) \{[\s\S]*?#view-settings \{([\s\S]*?)\}[\s\S]*?#view-settings > \.card \{([\s\S]*?)\}/);
  assert.ok(wide, 'wide settings layout block missing');
  assert.match(wide[1], /height:\s*100%/);
  assert.match(wide[1], /min-height:\s*0/);
  assert.match(wide[1], /overflow-y:\s*auto/);
  assert.match(wide[1], /grid-auto-rows:\s*max-content/);
  assert.match(wide[1], /row-gap:\s*14px/);
  assert.match(wide[1], /column-gap:\s*14px/);
  assert.match(wide[1], /align-items:\s*start/);
  assert.match(wide[2], /min-height:\s*max-content/);
  assert.match(wide[2], /align-self:\s*start/);
});

test('settings view preserves non-shrinking cards and scrolls inside the panel viewport', () => {
  assert.match(css, /#view-settings\s*\{[\s\S]*?height:\s*100%;[\s\S]*?min-height:\s*0;[\s\S]*?overflow-y:\s*auto;[\s\S]*?\}/);
});
