const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('6.3.11 release notes come only from GitHub Releases at runtime', () => {
  const main = fs.readFileSync(path.join(root, 'src/main/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(root, 'src/preload/bee-preload.js'), 'utf8');
  const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const notes = fs.readFileSync(path.join(root, 'src/renderer/bee/release-notes.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');

  assert.match(main, /api\.github\.com\/repos\/EmreGUNDOGAN\/nero-desktop-companion-v2\/releases\?per_page=100/);
  assert.match(main, /ipcMain\.handle\('bee:releases'/);
  assert.match(preload, /releases:\s*\(\)\s*=>\s*ipcRenderer\.invoke\('bee:releases'\)/);
  assert.match(renderer, /window\.bee\.releases\(\)/);
  assert.match(renderer, /releaseToNote/);
  assert.doesNotMatch(notes, /export const RELEASE_NOTES/);
  assert.match(html, /id="whats-new-all-releases-link"[^>]*>↗ Tam inceleme listesi</);
});

test('6.3.11 warning-center button remains visible with zero active warnings', () => {
  const renderer = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  assert.match(renderer, /btn\.hidden=false/);
  assert.match(renderer, /Şu an aktif uyarı yok/);
  assert.doesNotMatch(renderer, /btn\.hidden=!items\.length/);
});

test('6.3.11 restores the pre-rollback panel spacing code while keeping theme asset folders removed', () => {
  const panel = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.js'), 'utf8');
  const skins = fs.readFileSync(path.join(root, 'src/renderer/panel/skins.css'), 'utf8');
  assert.ok(panel.length > 80000, 'panel renderer regressed to truncated rollback version');
  assert.ok(skins.length > 140000, 'skin/layout rules regressed to truncated rollback version');
  for (const id of ["sonbahar-kutuphanesi","amalfi-limonlari","ortancali-kir-evi","kis-tramvayi","doksanlar-kirtasiye","gece-treni","eski-fotografci","lavanta-aksami","kis-bahcesi","gece-masasi","analog-radyo","pastel-mutfak"]) {
    assert.equal(fs.existsSync(path.join(root, 'themes', id)), false, id + ' theme asset folder returned');
  }
});
