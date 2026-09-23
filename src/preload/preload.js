// Arayüzün ana süreçle konuşabildiği tek köprü. Sadece listedeki kanallara izin verilir.

const { contextBridge, ipcRenderer } = require('electron');

const INVOKE = new Set([
  'state:get', 'theme:get',
  'notes:save', 'notes:delete', 'notes:archive',
  'todos:add', 'todos:toggle', 'todos:rename', 'todos:delete', 'todos:clearDone', 'todos:archive', 'todos:archiveDone', 'todos:setReminder',
  'todos:stopwatchStart', 'todos:stopwatchPause', 'jar:add', 'moodboard:get', 'moodboard:set',
  'data:export', 'data:import', 'data:openBackups',
  'update:check', 'update:install', 'update:onQuit', 'update:dismiss',
  'timer:start', 'timer:pause', 'timer:resume', 'timer:cancel', 'timer:badge',
  'settings:set', 'themes:reload', 'themes:openFolder', 'themes:openGuide',
  'mood:reset', 'stats:resetDisplay', 'home:seen', 'home:debugSelect', 'home:debugContext', 'day:mode', 'rest:exit', 'rest:start', 'rest:goodnight', 'panel:hide', 'panel:minimize', 'panel:open', 'app:quit'
]);

const SEND = new Set([
  'char:ready', 'char:ignoreMouse', 'char:dragStart', 'char:dragEnd',
  'char:click', 'char:contextMenu', 'char:bubbleDone', 'char:pet', 'char:hoverStart', 'char:hoverEnd',
  'panel:dragStart', 'panel:dragEnd',
  'panel:resizeStart', 'panel:resizeEnd'
]);

const ON = new Set([
  'cursor', 'say', 'baseline', 'theme', 'settings', 'timer', 'state', 'panel:tab', 'sound', 'dragging', 'peek'
]);

contextBridge.exposeInMainWorld('nero', {
  invoke: (channel, ...args) => {
    if (!INVOKE.has(channel)) return Promise.reject(new Error(`İzin verilmeyen kanal: ${channel}`));
    return ipcRenderer.invoke(channel, ...args);
  },
  send: (channel, ...args) => {
    if (SEND.has(channel)) ipcRenderer.send(channel, ...args);
  },
  on: (channel, callback) => {
    if (!ON.has(channel)) return () => {};
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  }
});
