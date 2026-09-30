const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'src/renderer/panel/skins.css'), 'utf8');
const panelCss = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.css'), 'utf8');
const ids = ["sonbahar-kutuphanesi","amalfi-limonlari","ortancali-kir-evi","kis-tramvayi","doksanlar-kirtasiye","gece-treni","eski-fotografci","lavanta-aksami","kis-bahcesi","gece-masasi","analog-radyo","pastel-mutfak"];

test('6.3.7 themed skins cannot override core layout geometry', () => {
  const marker = '6.3.7 — güvenli program temaları';
  const section = css.slice(css.indexOf(marker));
  assert.doesNotMatch(section, /\.shell\s*>\s*\*/);
  assert.doesNotMatch(section, /\.tabs\s*\{[^}]*\b(?:margin|padding|height|width|display|position|gap)\s*:/s);
  assert.doesNotMatch(section, /\.card\s*\{[^}]*\b(?:margin|padding|height|width|display|position|grid|flex)\s*:/s);
  assert.match(panelCss, /\.grip\s*\{[^}]*position:\s*absolute/s);
  assert.match(section, /\.grip\s*\{[^}]*position:\s*absolute\s*!important/s);
});

test('6.3.7 all program themes have clear vector scene assets for main, timer and work views', () => {
  for (const id of ids) {
    for (const name of ['bg-main.svg','bg-timer.svg','bg-work.svg']) {
      const p = path.join(root, 'src/renderer/panel/deco', id, name);
      assert.ok(fs.existsSync(p), `${id} missing ${name}`);
      const svg = fs.readFileSync(p,'utf8');
      assert.match(svg, /^<svg/);
      assert.ok(svg.length > 1000, `${id}/${name} too sparse`);
      assert.doesNotMatch(svg, /<image\b|data:image\//i);
    }
  }
});

test('6.3.7 badge system stays original; themes only recolor badge background', () => {
  const panel = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.js'), 'utf8');
  const section = css.slice(css.indexOf('6.3.7 — güvenli program temaları'));
  assert.match(panel, /icon\.className = 'badge-icon';\s*icon\.textContent = a\.unlockedAt \? a\.icon : '\?';/s);
  assert.match(section, /\.badge\.on \.badge-icon\s*\{[^}]*background:\s*var\(--theme-badge\)/s);
  assert.doesNotMatch(section, /badge-icon[^}]*background-image:/s);
});
