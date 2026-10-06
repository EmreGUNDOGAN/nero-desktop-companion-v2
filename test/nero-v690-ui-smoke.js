'use strict';
const { app, BrowserWindow, ipcMain, protocol, net } = require('electron');
const assert = require('node:assert/strict'), path = require('node:path'), fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { ThemeManager } = require('../src/main/themes');
const root = path.join(__dirname, '..');
app.setPath('userData', path.join(app.getPath('temp'), `nero-v690-ui-${process.pid}`));
protocol.registerSchemesAsPrivileged([{ scheme: 'nero-theme', privileges: { standard: true, secure: true, corsEnabled: true, supportFetchAPI: true } }]);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
app.whenReady().then(async () => {
  const errors = [], windows = [];
  function window(preload) {
    const win = new BrowserWindow({ width: 440, height: 660, show: false, frame: false, webPreferences: { preload, sandbox: false, contextIsolation: true, offscreen: true } });
    windows.push(win); win.webContents.on('console-message', (_e, level, text) => { if (level >= 3) errors.push(text); });
    return win;
  }
  try {
    protocol.handle('nero-theme', request => {
      const url = new URL(request.url);
      return net.fetch(pathToFileURL(path.join(root, 'themes', url.hostname, decodeURIComponent(url.pathname))).href);
    });
    const panel = window(path.join(__dirname, 'nero-v690-ui-preload.js'));
    await panel.loadFile(path.join(root, 'src/renderer/panel/index.html')); await wait(300);
    for (const [width,height] of [[440,660],[380,540],[700,860]]) {
      panel.setSize(width, height); await wait(70);
      const layout = await panel.webContents.executeJavaScript(`(() => {
        document.querySelector('[data-tab="home"]').click();
        const main = document.getElementById('view-home'), r = main.getBoundingClientRect();
        return {skin:document.documentElement.dataset.skin, overflow:main.scrollWidth-main.clientWidth, height:r.height, tabs:[...document.querySelectorAll('.tabs button')].map(b=>b.getBoundingClientRect().width)};
      })()`);
      assert.equal(layout.skin,'radyo-aksami'); assert.ok(layout.overflow <= 2, JSON.stringify(layout)); assert.ok(layout.height>100); assert.ok(layout.tabs.every(w=>w>30));
    }
    panel.setSize(440,660); await wait(70);
    await panel.webContents.executeJavaScript(`document.querySelector('[data-tab="todos"]').click(); true`);
    const taskLayout = await panel.webContents.executeJavaScript(`(() => ({children:document.querySelectorAll('.subtask').length,overflow:document.getElementById('view-todos').scrollWidth-document.getElementById('view-todos').clientWidth}))()`);
    assert.equal(taskLayout.children,2); assert.ok(taskLayout.overflow<=2,JSON.stringify(taskLayout));
    await panel.webContents.executeJavaScript(`(() => {const row=document.querySelector('[data-todo-id="t2"]'); const r=row.getBoundingClientRect(); row.querySelector('.todo-text').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0,clientY:r.top+10,clientX:r.left+30}));return true;})()`);
    await wait(320);
    await panel.webContents.executeJavaScript(`(() => {const r=document.querySelector('[data-todo-id="t1"]').getBoundingClientRect();document.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientY:r.top+2}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));return true;})()`); await wait(100);
    const order = await panel.webContents.executeJavaScript(`[...document.querySelectorAll('#todo-list>li')].map(t=>t.dataset.todoId)`); assert.deepEqual(order,['t2','t1']);
    const calls = await panel.webContents.executeJavaScript('window.nero.__getCalls()'); assert.ok(calls.some(c=>c.channel==='todos:reorder'));
    await panel.webContents.executeJavaScript(`document.querySelector('[data-todo-id="t1"] .todo-add-child').click(); document.querySelector('.subtask-input').value='Üçüncü sayfayı boya'; document.querySelector('.subtask-form').requestSubmit(); true`); await wait(100);
    assert.equal(await panel.webContents.executeJavaScript(`document.querySelectorAll('.subtask').length`),3);
    const manager = new ThemeManager({ builtinDir: path.join(root,'themes'), userDir: path.join(root,'none') }); manager.scan(); const manifest = manager.get('radyo-aksami').manifest;
    ipcMain.handle('focusNotice:get', () => ({manifest,outfit:'daily-bahce-onlugu',minutes:25}));
    ipcMain.on('focusNotice:close', () => {});
    const notice = window(path.join(root,'src/preload/notification-preload.js')); notice.setSize(390,205);
    await notice.loadFile(path.join(root,'src/renderer/notification/index.html')); await wait(600);
    const portrait = await notice.webContents.executeJavaScript(`(() => ({visible:[...document.querySelectorAll('.layer.on')].length, loaded:[...document.querySelectorAll('.layer.on')].every(i=>i.complete&&i.naturalWidth>0), outfit:document.querySelector('.layer-body.on')?.src,duration:document.getElementById('duration').textContent,overflow:document.documentElement.scrollWidth-window.innerWidth}))()`);
    assert.ok(portrait.visible>=5,JSON.stringify(portrait));assert.equal(portrait.loaded,true); assert.match(portrait.outfit,/daily-bahce-onlugu/);assert.match(portrait.duration,/25/);assert.equal(portrait.overflow,0);
    assert.deepEqual(errors,[]);
    await panel.webContents.executeJavaScript(`document.querySelector('[data-tab="home"]').click(); true`);
    await wait(300);
    fs.writeFileSync('/tmp/nero-radio-preview.png', (await panel.webContents.capturePage()).toPNG());
    fs.writeFileSync('/tmp/nero-notice-preview.png', (await notice.webContents.capturePage()).toPNG());
    console.log('UI smoke passed: 440×660 / 380×540 / 700×860, nested tasks, long-hold reorder, add child, actual character notice.');
    app.exit(0);
  } catch (err) {console.error(err);app.exit(1);}
});
