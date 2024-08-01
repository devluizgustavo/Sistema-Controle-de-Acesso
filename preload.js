const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  getAuth: (arg) => ipcRenderer.invoke('auth-required', arg),
  getLogin: (arg) => ipcRenderer.invoke('form-login', arg),
  getRegister: (arg) => ipcRenderer.invoke('form-register', arg), 
});


