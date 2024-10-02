const { BrowserWindow } = require('electron');
const path = require('path');

class WindowManager {
  constructor() {
    this.loginWindow = null;
    this.authWindow = null;
    this.registerWindow = null;
    this.homeWindow = null;
    this.releaseAccessWindow = null;
    this.registerPeopleWindow = null;
    this.accessHistoryLogWindow = null;
    this.dataEditWindow = null;
  }

  createWindow(options) {
    const window = new BrowserWindow({
      ...options,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
      },
    });

    window.once('ready-to-show', () => window.show());
    window.webContents.openDevTools(true);
    window.setMenuBarVisibility(false);

    return window;
  }

  createEditDataWindow() {
    this.dataEditWindow = this.createWindow({
      width: 1920,
      height: 1080,
      title: 'Editar Dados',
      modal: true,
      transparent: true,
      parent: this.homeWindow,
      show: false,
      center: true,
      resizable: false,
    });

    this.dataEditWindow.webContents.openDevTools(true);
    this.dataEditWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'editDataPage.html'));
  }

  createAuthPromptWindow() {
    this.promptWindow = this.createWindow({
      width: 650,
      height: 350,
      title: 'Alerta',
      icon: path.join(__dirname, 'assets', 'img', 'other', 'warning.png'),
      parent: this.loginWindow,
      show: false,
      center: true,
      resizable: true,
    });

    this.promptWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'authPage.html'));
  }

  createLoginWindow() {
    this.loginWindow = this.createWindow({
      height: 1920,
      width: 1080,
      title: 'Login',
      icon: path.join(__dirname, 'assets', 'img', 'icons', 'iconApp', '512x512.png'),
    });

    this.loginWindow.maximize();
    // this.mainWindow.webContents.openDevTools(true);
    this.loginWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'loginPage.html'));
  }

  createRegisterWindow() {
    this.registerWindow = this.createWindow({
      width: 1920,
      height: 1080,
      parent: this.loginWindow,
      title: 'Cadastro',
      show: false,
      center: true,
      resizable: true,
    });

    this.registerWindow.maximize();
    this.registerWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'registerPage.html'));
  }

  createHomeWindow() {
    this.homeWindow = this.createWindow({
      width: 1920,
      height: 1080,
      title: 'App Controle',
      show: false,
      center: true,
    });

    this.homeWindow.maximize();
    // this.homeWindow.webContents.openDevTools(true);
    this.homeWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'homePage.html'));
  }

  createRegisterPeopleWindow() {
    this.registerPeopleWindow = this.createWindow({
      width: 1450,
      height: 720,
      title: 'App Controle',
      modal: true,
      transparent: true,
      parent: this.homeWindow,
      show: false,
      center: true,
      resizable: false,
    });

    // this.registerPeopleWindow.webContents.openDevTools(true);
    this.registerPeopleWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'registerPeoplePage.html'));
  }

  createReleaseAccessWindow() {
    this.releaseAccessWindow = this.createWindow({
      width: 1200,
      height: 720,
      title: 'App Controle',
      modal: true,
      transparent: true,
      parent: this.homeWindow,
      show: false,
      center: true,
      resizable: false,
    });

    // this.releaseAccessWindow.webContents.openDevTools(true);
    this.releaseAccessWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'realeseAccessPage.html'));
  }

  createAccessHistoryLogWindow() {
    this.accessHistoryLogWindow = this.createWindow({
      width: 1280,
      height: 720,
      title: 'Histórico',
      modal: true,
      transparent: true,
      parent: this.homeWindow,
      show: false,
      center: true,
      resizable: false,
    });

    // this.accessHistoryLogWindow.webContents.openDevTools(true);
    this.accessHistoryLogWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'historyAccessPage.html'));
  }

}

module.exports = new WindowManager();