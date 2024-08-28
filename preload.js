const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  getAuth: (arg) => ipcRenderer.invoke('auth-required', arg),
  getLogin: (arg) => ipcRenderer.invoke('form-login', arg),
  getRegister: (arg) => ipcRenderer.invoke('form-register', arg), 
  getUser: () => ipcRenderer.invoke('get-user'),
  getCadPeople: (arg) => ipcRenderer.invoke('form-cad-peoples', arg),
  getAllRegisters: () => ipcRenderer.invoke('get-registers-peoples'),
  getAssuntoDepto: (arg) => ipcRenderer.invoke('get-assunto-depto', arg),
  setAccessHistorico: (arg) => ipcRenderer.invoke('set-historico-access', arg),
  getAllAccess: () => ipcRenderer.invoke('get-all-access'),
});


