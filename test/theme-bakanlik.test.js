const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { ThemeManager } = require('../src/main/themes');

const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'src/renderer/panel/skins.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.js'), 'utf8');

test('Erteleme Bakanlığı built-in olarak yüklenir ve default Nero katmanlarını miras alır', () => {
  const m = new ThemeManager({ builtinDir: path.join(root, 'themes'), userDir: path.join(os.tmpdir(), `nero-theme-empty-${process.pid}`) });
  const listed = m.scan();
  const row = listed.find((x) => x.id === 'bakanlik');
  assert.ok(row);
  assert.equal(row.broken, false);
  assert.deepEqual(row.errors, []);
  assert.equal(m.get('bakanlik').manifest.ui.skin, 'bakanlik');
});

test('Erteleme Bakanlığı beş ana sayfada ayrı bürokrasi metaforları kullanır', () => {
  assert.match(js, /brandTitle: 'Erteleme Bakanlığı'/);
  assert.match(js, /MESAİ DEVAM EDİYOR/);
  assert.match(css, /EVRAK NO/);
  assert.match(css, /İŞLEM SIRASI/);
  assert.match(css, /MESAİ TAKİP FORMU/);
  assert.match(js, /badgeTitle: 'HİZMET VE BAŞARI KAYITLARI'/);
});
