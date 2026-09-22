const path = require('path');
const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, Notification } = require('electron');
const store = require('./store');
const { getMood } = require('./mood');
const { randomLine } = require('./dialogue');
const { listThemes } = require('./themes');
const { FocusTimer } = require('./timer');

let characterWindow, panelWindow, tray;
const startedAt = Date.now();
const timer = new FocusTimer(
  remaining => characterWindow?.webContents.send('nero:timer-tick', remaining),
  () => { if (Notification.isSupported()) new Notification({ title: 'Nero', body: 'Odak süresi bitti.' }).show(); }
);

function createCharacter() {
  characterWindow = new BrowserWindow({
    width: 300, height: 360, transparent: true, frame: false, resizable: false,
    alwaysOnTop: true, skipTaskbar: true, hasShadow: false,
    webPreferences: { preload: path.join(__dirname, '..', 'preload', 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  characterWindow.loadFile(path.join(__dirname, '..', 'renderer', 'character', 'index.html'));
}
function createPanel() {
  if (panelWindow && !panelWindow.isDestroyed()) { panelWindow.show(); panelWindow.focus(); return; }
  panelWindow = new BrowserWindow({
    width: 760, height: 720, minWidth: 560, minHeight: 520,
    webPreferences: { preload: path.join(__dirname, '..', 'preload', 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  panelWindow.loadFile(path.join(__dirname, '..', 'renderer', 'panel', 'index.html'));
}
function createTray() {
  const iconPath = path.join(app.getAppPath(), 'build', 'icon.png');
  tray = new Tray(nativeImage.createFromPath(iconPath));
  tray.setToolTip('Nero');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Nero\'yu aç', click: createPanel },
    { type: 'separator' },
    { label: 'Çıkış', click: () => app.quit() }
  ]));
  tray.on('double-click', createPanel);
}
ipcMain.handle('nero:get-state', () => ({
  notes: store.read('notes.json', ''),
  todos: store.read('todos.json', []),
  mood: getMood(Date.now() - startedAt),
  line: randomLine(getMood(Date.now() - startedAt))
}));
ipcMain.handle('nero:save-notes', (_e, value) => store.write('notes.json', String(value || '')));
ipcMain.handle('nero:save-todos', (_e, value) => store.write('todos.json', Array.isArray(value) ? value : []));
ipcMain.handle('nero:get-themes', () => listThemes());
ipcMain.handle('nero:start-timer', (_e, minutes) => timer.start(minutes));
ipcMain.handle('nero:stop-timer', () => timer.stop());
ipcMain.handle('nero:quit', () => app.quit());

app.whenReady().then(() => { createCharacter(); createTray(); });
app.on('window-all-closed', e => e?.preventDefault?.());
app.on('activate', createPanel);
