const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const themes = [{"id":"sonbahar-kutuphanesi","name":"Sonbahar Kütüphanesi","badge":"#B7835A"},{"id":"amalfi-limonlari","name":"Amalfi Limonları","badge":"#7FAEC9"},{"id":"ortancali-kir-evi","name":"Ortancalı Kır Evi","badge":"#91AEC2"},{"id":"kis-tramvayi","name":"Kış Tramvayı","badge":"#9A5B59"},{"id":"doksanlar-kirtasiye","name":"90'lar Kırtasiye","badge":"#C8DDF4"},{"id":"gece-treni","name":"Gece Treni","badge":"#657B9A"},{"id":"eski-fotografci","name":"Eski Fotoğrafçı","badge":"#9A7656"},{"id":"lavanta-aksami","name":"Lavanta Akşamı","badge":"#9B89AF"},{"id":"kis-bahcesi","name":"Kış Bahçesi","badge":"#718B76"},{"id":"gece-masasi","name":"Gece Masası","badge":"#5E7396"},{"id":"analog-radyo","name":"Analog Radyo","badge":"#637461"},{"id":"pastel-mutfak","name":"Pastel Mutfak","badge":"#8FB69A"}];

test('6.3.6 includes every locked Turkish program theme', () => {
  for (const t of themes) {
    const dir = path.join(root, 'themes', t.id);
    const m = JSON.parse(fs.readFileSync(path.join(dir, 'theme.json'), 'utf8'));
    assert.equal(m.id, t.id);
    assert.equal(m.name, t.name);
    assert.equal(m.ui.skin, t.id);
    for (const file of ['body.svg','eyes.svg','pupils.svg','mouth-neutral.svg','mouth-talk1.svg','mouth-talk2.svg']) {
      assert.ok(fs.existsSync(path.join(dir, 'assets', file)), `${t.id} missing ${file}`);
    }
    assert.ok(fs.existsSync(path.join(root, 'src/renderer/panel/deco', t.id, 'scene.svg')));
    assert.ok(fs.existsSync(path.join(root, 'src/renderer/panel/deco', t.id, 'mark.svg')));
  }
});

test('6.3.6 new themes keep the default badge icon system and only recolor backgrounds', () => {
  const panel = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/panel/skins.css'), 'utf8');
  assert.match(panel, /icon\.className = 'badge-icon';\s*icon\.textContent = a\.unlockedAt \? a\.icon : '\?';/s);
  assert.match(css, /\.badge\.on \.badge-icon[^}]*background:\s*var\(--theme-badge\)/s);
  assert.doesNotMatch(css, /badge-icon[^}]*background-image:/s);
  assert.match(css, /doksanlar-kirtasiye[^\n]*\.badges \.badge:nth-child/);
});

test('6.3.6 program themes use controlled vector art instead of raster concept-board backgrounds', () => {
  for (const t of themes) {
    const svg = fs.readFileSync(path.join(root, 'src/renderer/panel/deco', t.id, 'scene.svg'), 'utf8');
    assert.match(svg, /^<svg/);
    assert.doesNotMatch(svg, /<image\b|data:image\/(png|jpe?g|webp)/i);
  }
});

test('6.3.6 Eski Fotoğrafçı art direction contains only photography-world scene geometry', () => {
  const svg = fs.readFileSync(path.join(root, 'src/renderer/panel/deco/eski-fotografci/scene.svg'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/panel/skins.css'), 'utf8');
  assert.ok(svg.length > 500);
  assert.match(css, /\[data-skin="eski-fotografci"\]/);
});
