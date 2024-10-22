const { app } = require('electron');
const windowManager = require('./windows.js');
const setupIPCHandlers = require('./src/ipcHandlers.js');

app.whenReady().then(() => {
  // Cria a janela de login
  windowManager.createLoginWindow();

  // Configura os handlers IPC
  setupIPCHandlers();

  // Lida com o fechamento do aplicativo
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (windowManager.mainWindow === null) {
      windowManager.createLoginWindow();
    }
  });
});