'use strict';
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('focusNotice', {
  get: () => ipcRenderer.invoke('focusNotice:get'),
  close: () => ipcRenderer.send('focusNotice:close')
});
