const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.css'), 'utf8');

test('6.3.14 settings view scrolls without shrinking its cards', () => {
  const wide = css.match(/@container \(min-width: 600px\) \{[\s\S]*?#view-settings \{([\s\S]*?)\}[\s\S]*?#view-settings > \.card/);
  assert.ok(wide, 'wide settings grid missing');
  assert.match(wide[1], /height:\s*100%/);
  assert.match(wide[1], /min-height:\s*0/);
  assert.match(wide[1], /overflow-y:\s*auto/);
  assert.match(wide[1], /scrollbar-gutter:\s*stable/);
  assert.match(wide[1], /grid-auto-rows:\s*max-content/);
  assert.match(wide[1], /row-gap:\s*14px/);
  assert.match(wide[1], /column-gap:\s*14px/);
  assert.doesNotMatch(wide[1], /height:\s*auto/);
});

test('6.3.14 uses the native full perimeter resize instead of corner-only overlay grips', () => {
  assert.match(css, /\.grip\s*\{[\s\S]*?display:\s*none\s*!important;[\s\S]*?pointer-events:\s*none\s*!important/);
});
