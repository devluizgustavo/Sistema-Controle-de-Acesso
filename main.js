const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const bcrypt = require('bcryptjs');
const { FindAll, Store, FindOne } = require('./src/util/dbRepository.js');
const { hashCompare, createdHash } = require('./src/bcrypt/bcryptFunc.js');
const { join } = require('path');

let mainWindow = null;
let promptWindow = null;
let registerWindow = null;
let controllerWindow = null;

let admin = null;
let sql = null;
let user = null;

class createAllWindows {
  static createAuthPromptWindow() {
    promptWindow = new BrowserWindow({
      width: 650,
      height: 350,
      title: 'Alerta',
      modal: true,
      icon: path.join(__dirname, 'assets', 'img', 'other', 'warning.png'),
      show: false,
      center: true,
      resizable: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
      },
    });

    promptWindow.setMenuBarVisibility(false);
    promptWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'authPage.html'));
  }

  static createLoginWindow() {
    mainWindow = new BrowserWindow({
      height: 1920,
      width: 1080,
      icon: path.join(__dirname, 'assets', 'img', 'icons', 'iconApp', '512x512.png'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
      }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.maximize();
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'loginPage.html'));

    // mainWindow.on('closed', () => {
    //   app.quit();
    // });
  }

  static createRegisterWindow() {
    registerWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      icon: path.join(__dirname, 'assets', 'img', 'icons', 'iconApp', '512x512.png'),
      title: 'Alerta',
      modal: true,
      show: false,
      center: true,
      resizable: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
      },
    });

    registerWindow.maximize();
    registerWindow.setMenuBarVisibility(false);
    registerWindow.webContents.openDevTools(true);
    registerWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'registerPage.html'));
  }

  static createControllerWindow() {
    controllerWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      icon: path.join(__dirname, 'assets', 'img', 'icons', 'iconApp', '512x512.png'),
      title: 'App Controle',
      modal: true,
      show: false,
      center: true,
      resizable: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
      },
    });

    controllerWindow.maximize();
    controllerWindow.webContents.openDevTools(true);
    controllerWindow.setMenuBarVisibility(false);
    controllerWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'controllerPage.html'));
  }
}

app.whenReady().then(() => {
  createAllWindows.createLoginWindow();
});

// Cheking Login User
ipcMain.handle('form-login', async (event, args) => {
  try {
    sql = `SELECT *
           FROM Controlador
           WHERE ctr_usu = (?)`;
    const userLog = await FindOne(sql, args.user);
    if (!userLog) return dialog.showErrorBox('Erro', 'Usuário não existe');
    if (userLog.ctr_usu !== args.user) return dialog.showErrorBox('Erro', 'Usuário inválido');
    if (!await hashCompare(args.password, userLog.ctr_senha)) return dialog.showErrorBox('Erro', 'Senha inválida');

    //If USER then inactivated, block your access
    if (userLog.ctr_ativo !== 1) return dialog.showErrorBox('Erro', 'Seu usuário está inativado. Acesso negado');
    user = userLog;
    return true;
  } catch (e) {
    console.log(e);
  }
});
// Checking Admin-Code-Send
ipcMain.handle('auth-required', async (event, args) => {
  try {
    sql = 'SELECT * FROM Admin';
    const allHashsDB = await FindAll(sql);
    for (let row of allHashsDB) {
      let hashs = row.adm_code;
      if (await hashCompare(args, hashs)) {
        admin = row;
        return true;
      }
    }
    // return dialog.showErrorBox('Negado', 'Chave de Acesso Inválida ou Expirada');
  } catch (e) {
    console.error('Ocorre um erro', e);
  }
});
// Checking data the Form-Register and Validation new User
ipcMain.handle('form-register', async (event, args) => {
  try {
    sql = 'INSERT INTO Controlador (ctr_usu, ctr_nome, ctr_sbnome, ctr_senha, ctr_created_by, ctr_sexo) VALUES (?, ?, ?, ?, ?, ?)';
    const hashPassword = await createdHash(args.password, 10);
    const row = await Store(sql, [args.user, args.name, args.lastname, hashPassword, admin.adm_id, args.sexo]);
    if (args == '') return dialog.showErrorBox('Erro', 'Campos digitados incorretamente');
    if (!row) return dialog.showErrorBox('Não foi possível cadastrar', 'Usuário já existe');
    return true;
  } catch (e) {
    console.log(e);
  }
});
// Get User From Renderer
ipcMain.handle('get-user', async (event) => {
  try {
    const res = await user;
    return res;
  } catch (e) {
    console.log(e);
  }
})

//Event-in-the-Pages
//After clicking the link, to go the registration page (LoginPage)
ipcMain.on('open-prompt', (event) => {
  createAllWindows.createAuthPromptWindow()
  promptWindow.once('ready-to-show', () => {
    promptWindow.show();
  });
});
//If the access code is correct, redirect
ipcMain.on('success-auth', () => {
  dialog.showMessageBoxSync(promptWindow, {
    title: 'Acesso Concedido',
    message: `Bem vindo ${admin.adm_name}`,
  });
  promptWindow.close();
  mainWindow.close();
  createAllWindows.createRegisterWindow();
});
//If the register is correct, redirect
ipcMain.on('success-register', () => {
  dialog.showMessageBoxSync(registerWindow, {
    title: 'Sucesso',
    message: 'Usuário cadastrado com êxito!',
  });
  registerWindow.close();
  createAllWindows.createLoginWindow();
})
//If the login is correct, redirect
ipcMain.on('success-login', () => {
  dialog.showMessageBoxSync(mainWindow, {
    title: 'Login feito com sucesso',
    message: `Sua sessão será iniciada`
  });
  mainWindow.close();
  createAllWindows.createControllerWindow()
})
//if the access code is wrong
ipcMain.on('block-prompt', () => {
  dialog.showErrorBox('Acesso Negado', 'Sua sessão será encerrada');
  app.quit();
});
//After CLICK in the Back, to back for LoginPage (RegisterPage)
ipcMain.on('go-back', (event) => {
  registerWindow.close();
  createAllWindows.createLoginWindow();
});
