// Hızlı yakalama penceresi için en dar izinli köprü.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('neroQuick', {
  addTodo: (text) => ipcRenderer.invoke('quick:addTodo', text),
  addNote: (text) => ipcRenderer.invoke('quick:addNote', text),
  close: () => ipcRenderer.send('quick:close')
});
