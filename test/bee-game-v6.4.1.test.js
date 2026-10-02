const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('6.4.1 depot shows harvested beekeeping materials', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.css'), 'utf8');

  assert.match(html, /id="warehouse-modal"/);
  assert.match(html, /data-warehouse-tab="apiary"/);
  assert.match(js, /view\.materials/);
  assert.match(js, /Propolis/);
  assert.match(js, /Arı Sütü/);
  assert.match(css, /\.warehouse-card/);
});

test('6.4.1 regression runs on 6.4.1 or newer', () => {
  const pkg = require('../package.json');
  const [major, minor, patch] = pkg.version.split('.').map(Number);
  assert.ok(major > 6 || (major === 6 && (minor > 4 || (minor === 4 && patch >= 1))));
});
