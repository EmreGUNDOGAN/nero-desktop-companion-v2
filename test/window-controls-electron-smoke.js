const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const skins = ['kar', 'yagmur', 'cilek', 'mum', 'ege'];
const ids = ['settings-button', 'pin', 'minimize', 'close'];

app.whenReady().then(async () => {
  let win;
  try {
    win = new BrowserWindow({
      width: 720,
      height: 980,
      show: false,
      frame: false,
      transparent: true,
      webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
    });

    await win.loadFile(path.join(__dirname, '../src/renderer/panel/index.html'));
    await wait(200);

    const hierarchyOk = await win.webContents.executeJavaScript(`
      (() => {
        const group = document.querySelector('.window-controls');
        const top = document.querySelector('.top');
        return !!group && !!top && group.parentElement === top.parentElement && !top.contains(group);
      })()
    `);
    if (!hierarchyOk) throw new Error('window-controls draggable header dışında değil.');

    for (const skin of skins) {
      await win.webContents.executeJavaScript(`
        document.documentElement.dataset.skin = ${JSON.stringify(skin)};
        true;
      `);
      await wait(80);

      for (const id of ids) {
        const info = await win.webContents.executeJavaScript(`
          (() => {
            const el = document.getElementById(${JSON.stringify(id)});
            const r = el.getBoundingClientRect();
            const x = Math.round(r.left + r.width / 2);
            const y = Math.round(r.top + r.height / 2);
            const hit = document.elementFromPoint(x, y);
            window.__headerClickHit = false;
            el.addEventListener('click', (e) => {
              e.stopImmediatePropagation();
              e.preventDefault();
              window.__headerClickHit = true;
            }, { capture: true, once: true });
            return {
              x, y, w: r.width, h: r.height,
              hitId: hit && (hit.id || (hit.closest && hit.closest('button')?.id) || ''),
              appRegion: getComputedStyle(el).getPropertyValue('-webkit-app-region'),
              groupRegion: getComputedStyle(el.parentElement).getPropertyValue('-webkit-app-region')
            };
          })()
        `);

        if (!info.w || !info.h) throw new Error(`${skin}/${id}: kontrol görünür değil.`);
        if (info.hitId !== id) throw new Error(`${skin}/${id}: elementFromPoint başka katmana gidiyor: ${info.hitId}`);
        if (info.appRegion.trim() !== 'no-drag') throw new Error(`${skin}/${id}: buton no-drag değil: ${info.appRegion}`);
        if (info.groupRegion.trim() !== 'no-drag') throw new Error(`${skin}/${id}: grup no-drag değil: ${info.groupRegion}`);

        win.webContents.sendInput({ type: 'mouseDown', x: info.x, y: info.y, button: 'left', clickCount: 1 });
        win.webContents.sendInput({ type: 'mouseUp', x: info.x, y: info.y, button: 'left', clickCount: 1 });
        await wait(60);
        const clicked = await win.webContents.executeJavaScript('window.__headerClickHit === true');
        if (!clicked) throw new Error(`${skin}/${id}: native click event ulaşmadı.`);
      }
    }

    console.log('window-controls-electron-smoke: ok');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (win && !win.isDestroyed()) win.destroy();
    app.quit();
  }
});
