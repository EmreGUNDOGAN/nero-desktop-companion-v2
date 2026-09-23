const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const skins = ['latte','pazartesi','gece','disket','kasaba','yagmur','kar','cilek','mum','ege'];
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const ensure = (condition, message) => { if (!condition) throw new Error(message); };

app.whenReady().then(async () => {
  let win;
  try {
    win = new BrowserWindow({
      width: 480,
      height: 820,
      show: false,
      frame: false,
      transparent: true,
      webPreferences: {
        preload: path.join(__dirname, 'panel-integration-preload.js'),
        contextIsolation: true,
        sandbox: false,
        nodeIntegration: false
      }
    });
    await win.loadFile(path.join(__dirname, '../src/renderer/panel/index.html'));
    await wait(300);

    for (const skin of skins) {
      const result = await win.webContents.executeJavaScript(`
        (() => {
          document.documentElement.dataset.skin = ${JSON.stringify(skin)};
          document.querySelector('[data-tab="home"]').click();
          const button = document.querySelector('.week .section-help');
          button.click();
          const layer = document.getElementById('section-tooltip-layer');
          const br = button.getBoundingClientRect();
          const tr = layer.getBoundingClientRect();
          const bs = getComputedStyle(button);
          const ts = getComputedStyle(layer);
          const nested = button.querySelector('.section-tooltip');
          return {
            button:{ width:br.width, height:br.height, border:bs.borderTopWidth, background:bs.backgroundColor },
            tooltip:{ left:tr.left, top:tr.top, right:tr.right, bottom:tr.bottom, width:tr.width, height:tr.height, z:ts.zIndex, hidden:layer.hidden, text:layer.textContent.trim() },
            nestedDisplay:getComputedStyle(nested).display,
            parentTag:layer.parentElement.tagName,
            openCount:document.querySelectorAll('.section-help.open').length,
            viewport:{ width:innerWidth, height:innerHeight }
          };
        })()
      `);

      ensure(result.button.width >= 18 && result.button.width <= 20, `${skin}: yardım hit area genişliği yanlış ${JSON.stringify(result)}`);
      ensure(result.button.height >= 18 && result.button.height <= 20, `${skin}: yardım hit area yüksekliği yanlış ${JSON.stringify(result)}`);
      ensure(result.button.border === '0px', `${skin}: yardım ikonunda border kaldı ${JSON.stringify(result)}`);
      ensure(result.tooltip.hidden === false && result.tooltip.width > 50 && result.tooltip.height > 15, `${skin}: tooltip görünmüyor ${JSON.stringify(result)}`);
      ensure(result.tooltip.left >= 10 && result.tooltip.right <= result.viewport.width - 10, `${skin}: tooltip yatay viewport dışına taşıyor ${JSON.stringify(result)}`);
      ensure(result.tooltip.top >= 10 && result.tooltip.bottom <= result.viewport.height - 10, `${skin}: tooltip dikey viewport dışına taşıyor ${JSON.stringify(result)}`);
      ensure(Number(result.tooltip.z) >= 10000, `${skin}: tooltip katmanı yeterince üstte değil ${JSON.stringify(result)}`);
      ensure(result.nestedDisplay === 'none', `${skin}: eski nested tooltip görünür kalmış ${JSON.stringify(result)}`);
      ensure(result.parentTag === 'BODY', `${skin}: tooltip root body seviyesinde değil ${JSON.stringify(result)}`);
      ensure(result.openCount === 1, `${skin}: aynı anda birden fazla yardım açık ${JSON.stringify(result)}`);
      ensure(result.tooltip.text.length > 10, `${skin}: tooltip metni boş ${JSON.stringify(result)}`);

      await win.webContents.executeJavaScript(`
        document.querySelector('.section-help.open')?.click();
        true;
      `);
    }

    console.log('help-checkpoint-d-electron-smoke: ok');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (win && !win.isDestroyed()) win.destroy();
    app.quit();
  }
});
