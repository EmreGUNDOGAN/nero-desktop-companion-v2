// Arıcılık penceresi için dar izinli köprü.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bee', {
  state: () => ipcRenderer.invoke('bee:state'),
  summary: () => ipcRenderer.invoke('bee:summary'),
  photo: () => ipcRenderer.invoke('bee:photo'),
  openPhotos: () => ipcRenderer.invoke('bee:openPhotos'),
  exportSave: () => ipcRenderer.invoke('bee:export'),
  importSave: () => ipcRenderer.invoke('bee:import'),
  resetGame: () => ipcRenderer.invoke('bee:reset'),
  act: (action, a, b) => ipcRenderer.invoke('bee:action', action, a, b),
  onState: (fn) => {
    const handler = (_e, v) => fn(v);
    ipcRenderer.on('bee:state', handler);
    return () => ipcRenderer.removeListener('bee:state', handler);
  },
  onEvents: (fn) => {
    const handler = (_e, v) => fn(v);
    ipcRenderer.on('bee:events', handler);
    return () => ipcRenderer.removeListener('bee:events', handler);
  }
});
