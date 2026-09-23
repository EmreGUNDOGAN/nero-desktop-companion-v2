const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ensure = (condition, message) => { if (!condition) throw new Error(message); };

app.whenReady().then(async () => {
  let win;
  try {
    win = new BrowserWindow({
      width: 720,
      height: 900,
      show: true,
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
    await wait(250);

    const point = await win.webContents.executeJavaScript(`
      (() => {
        const el = document.querySelector('.panel-drag-zone');
        const r = el.getBoundingClientRect();
        const x = Math.round(r.left + Math.min(120, r.width / 2));
        const y = Math.round(r.top + Math.min(32, r.height / 2));
        const hit = document.elementFromPoint(x, y);
        return {
          x, y, w:r.width, h:r.height,
          hitClass: hit?.className || '',
          region:getComputedStyle(el).getPropertyValue('-webkit-app-region').trim()
        };
      })()
    `);

    ensure(point.w > 80 && point.h >= 80, `drag zone çok küçük: ${JSON.stringify(point)}`);
    ensure(String(point.hitClass).includes('panel-drag-zone'), `drag zone hit-test alamıyor: ${JSON.stringify(point)}`);
    ensure(point.region === 'no-drag', `native app-region beklenmiyordu: ${point.region}`);

    for (let i = 0; i < 5; i++) {
      win.webContents.sendInputEvent({ type:'mouseMove', x:point.x, y:point.y });
      win.webContents.sendInputEvent({ type:'mouseDown', x:point.x, y:point.y, button:'left', clickCount:1 });
      await wait(30);
      win.webContents.sendInputEvent({ type:'mouseMove', x:point.x + 12, y:point.y + 3, button:'left' });
      await wait(30);
      win.webContents.sendInputEvent({ type:'mouseUp', x:point.x + 12, y:point.y + 3, button:'left', clickCount:1 });
      await wait(50);
    }

    const result = await win.webContents.executeJavaScript(`
      (() => {
        const calls = window.nero.__getCalls();
        return {
          starts:calls.filter(x => x.channel === 'panel:dragStart').length,
          ends:calls.filter(x => x.channel === 'panel:dragEnd').length,
          active:document.querySelector('.panel-drag-zone').classList.contains('dragging')
        };
      })()
    `);

    ensure(result.starts === 5, `panel dragStart 5 değil: ${JSON.stringify(result)}`);
    ensure(result.ends === 5, `panel dragEnd 5 değil: ${JSON.stringify(result)}`);
    ensure(!result.active, 'panel drag state son gesture sonrasında açık kaldı');

    console.log('panel-pointer-electron-smoke: ok');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (win && !win.isDestroyed()) win.destroy();
    app.quit();
  }
});
