const { BrowserWindow } = require('electron');
const path = require('path');

class WindowManager {
  constructor() {
    this.mainWindow = null;
    this.authWindow = null;
    this.registerWindow = null;
    this.controllerWindow = null;
    this.releaseAccessWindow = null;
    this.registerPeopleWindow = null;
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
    window.setMenuBarVisibility(false);

    return window;
  }

  createAuthPromptWindow() {
    this.promptWindow = this.createWindow({
      width: 650,
      height: 350,
      title: 'Alerta',
      icon: path.join(__dirname, 'assets', 'img', 'other', 'warning.png'),
      parent: this.mainWindow,
      show: false,
      center: true,
      resizable: true,
    });

    this.promptWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'authPage.html'));
  }

  createLoginWindow() {
    this.mainWindow = this.createWindow({
      height: 1920,
      width: 1080,
      icon: path.join(__dirname, 'assets', 'img', 'icons', 'iconApp', '512x512.png'),
    });

    this.mainWindow.maximize();
    this.mainWindow.webContents.openDevTools(true);
    this.mainWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'loginPage.html'));
  }

  createRegisterWindow() {
    this.registerWindow = this.createWindow({
      width: 1920,
      height: 1080,
      title: 'Alerta',
      show: false,
      center: true,
      resizable: true,
    });

    this.registerWindow.maximize();
    this.registerWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'registerPage.html'));
  }

  createControllerWindow() {
    this.controllerWindow = this.createWindow({
      width: 1920,
      height: 1080,
      title: 'App Controle',
      show: false,
      center: true,
    });

    this.controllerWindow.maximize();
    this.controllerWindow.webContents.openDevTools(true);
    this.controllerWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'controllerPage.html'));
  }

  createRegisterPeopleWindow() {
    this.registerPeopleWindow = this.createWindow({
      width: 1280,
      height: 720,
      title: 'App Controle',
      modal: true,
      frame: false,
      transparent: true,
      parent: this.controllerWindow,
      show: false,
      center: true,
      resizable: false,
    });

    this.registerPeopleWindow.webContents.openDevTools(true);
    this.registerPeopleWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'registerPeoplePage.html'));
  }

  createReleaseAccessWindow() {
    this.releaseAccessWindow = this.createWindow({
      width: 1100,
      height: 720,
      title: 'App Controle',
      modal: true,
      frame: false,
      transparent: true,
      parent: this.controllerWindow,
      show: false,
      center: true,
      resizable: false,
    });

    this.releaseAccessWindow.webContents.openDevTools(true);
    this.releaseAccessWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'realeseAccessPage.html'));
  }
}

module.exports = new WindowManager();