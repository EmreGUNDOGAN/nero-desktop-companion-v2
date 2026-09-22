const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('nero', {
  getState: () => ipcRenderer.invoke('nero:get-state'),
  saveNotes: notes => ipcRenderer.invoke('nero:save-notes', notes),
  saveTodos: todos => ipcRenderer.invoke('nero:save-todos', todos),
  getThemes: () => ipcRenderer.invoke('nero:get-themes'),
  startTimer: minutes => ipcRenderer.invoke('nero:start-timer', minutes),
  stopTimer: () => ipcRenderer.invoke('nero:stop-timer'),
  quit: () => ipcRenderer.invoke('nero:quit')
});
