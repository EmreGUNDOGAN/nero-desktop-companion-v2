const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('6.4.1 depot shows harvested beekeeping materials', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.css'), 'utf8');

  assert.match(html, /id="depot-materials"/);
  assert.match(html, /Arıcılık Malzemeleri/);
  assert.match(js, /view\.materials/);
  assert.match(js, /Propolis/);
  assert.match(js, /Arı Sütü/);
  assert.match(css, /\.depot-material/);
});

test('6.4.1 package version', () => {
  const pkg = require('../package.json');
  assert.equal(pkg.version, '6.4.1');
});
