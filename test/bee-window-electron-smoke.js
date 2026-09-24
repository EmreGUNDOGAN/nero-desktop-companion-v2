const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { BeeGame } = require('../src/main/bee');

app.commandLine.appendSwitch('enable-unsafe-swiftshader');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ensure = (condition, message) => { if (!condition) throw new Error(message); };

class MemoryStore {
  constructor(value = {}) { this.value = value; }
  get() { return this.value; }
  set(value) { this.value = value; }
  flush() {}
}

app.whenReady().then(async () => {
  let win;
  const rendererErrors = [];
  const bee = new BeeGame(new MemoryStore({}));

  ipcMain.handle('bee:state', () => bee.view());
  ipcMain.handle('bee:summary', () => null);
  ipcMain.handle('bee:action', () => ({ res: { ok: false, msg: '' }, view: bee.view(), events: [] }));

  try {
    win = new BrowserWindow({
      width: 1100,
      height: 720,
      show: false,
      backgroundColor: '#CFE9F7',
      webPreferences: {
        preload: path.join(__dirname, '../src/preload/bee-preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });

    win.webContents.on('console-message', (_event, level, message) => {
      if (level >= 3) rendererErrors.push(message);
    });

    await win.loadFile(path.join(__dirname, '../src/renderer/bee/index.html'));
    await wait(2500);

    const info = await win.webContents.executeJavaScript(`
      (() => {
        const canvas = document.querySelector('canvas');
        const errorText = document.body.innerText || '';
        return {
          hasApi: !!window.bee && typeof window.bee.state === 'function' && typeof window.bee.act === 'function',
          canvas: canvas ? { width: canvas.clientWidth, height: canvas.clientHeight } : null,
          title: document.title,
          hasThreeError: /3D çizim başlatılamadı/i.test(errorText),
          bodyWidth: document.body.clientWidth,
          bodyHeight: document.body.clientHeight
        };
      })()
    `);

    ensure(info.hasApi, 'window.bee preload API bulunamadı.');
    ensure(info.canvas && info.canvas.width > 300 && info.canvas.height > 200, `3D canvas görünür değil: ${JSON.stringify(info)}`);
    ensure(!info.hasThreeError, 'Renderer 3D başlatma hatası gösterdi.');
    ensure(info.bodyWidth > 700 && info.bodyHeight > 500, `Oyun penceresi layoutu çökmüş: ${JSON.stringify(info)}`);
    ensure(rendererErrors.length === 0, `Renderer console error: ${rendererErrors.join(' | ')}`);

    console.log('bee-window-electron-smoke: ok');
  } catch (err) {
    console.error(err);
    if (rendererErrors.length) console.error('renderer errors:', rendererErrors);
    process.exitCode = 1;
  } finally {
    for (const channel of ['bee:state','bee:summary','bee:action']) {
      try { ipcMain.removeHandler(channel); } catch (_) {}
    }
    if (win && !win.isDestroyed()) win.destroy();
    app.quit();
  }
});
