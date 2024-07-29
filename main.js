const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3');
const db_connection = require('./src/database/connection.js');
const { FindAll, Store, FindOne } = require('./src/util/dbRepository.js');
const { createHash } = require('crypto');

mainWindow = null;
promptWindow = null;
registerWindow = null;

let admin = null;
let sql = null;

function hashCompare(userInputCode, DbHashCode) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(userInputCode, DbHashCode, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function createdHash(code, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(code, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    })
  })
}

class createAllWindows {
  static createPromptWindow() {
    promptWindow = new BrowserWindow({
      width: 650,
      height: 350,
      title: 'Alerta',
      modal: true,
      show: false,
      center: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });

    // promptWindow.webContents.openDevTools(true);
    promptWindow.setMenuBarVisibility(false);
    promptWindow.loadFile(path.join(__dirname, 'frontend', 'views', 'homePrompt.html'));
  }

  static createLoginWindow() {
    mainWindow = new BrowserWindow({
      height: 1920,
      width: 1080,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.maximize();
    // mainWindow.webContents.openDevTools(true);
    mainWindow.loadFile(path.join(__dirname, 'frontend', 'views', 'homePage.html'));

    // mainWindow.on('closed', () => {
    //   app.quit();
    // });
  }

  static createRegisterWindow() {
    registerWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      title: 'Alerta',
      modal: true,
      show: false,
      center: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });

    registerWindow.maximize();
    registerWindow.setMenuBarVisibility(false);
    // registerWindow.webContents.openDevTools(true);
    registerWindow.loadFile(path.join(__dirname, 'frontend', 'views', 'registerPage.html'));
  }
}

app.whenReady().then(() => {
  createAllWindows.createLoginWindow();
});

// Capture Form-Login
ipcMain.on('form-login', async (event, args) => {
  try {
    sql = `SELECT ctr_usu, ctr_senha
           FROM Controlador
           WHERE ctr_usu = (?)`;
    const userAndPassHash = await FindOne(sql, args.user);

    if (!userAndPassHash) {
      dialog.showErrorBox('Erro', 'Usuário não existe');
    }

  } catch(e) {
    console.log(e);
  }
});
// Checking User-Code-Send
ipcMain.on('auth-required', async (event, code) => {
  try {
    sql = 'SELECT * FROM Admin';
    const allHashsDB = await FindAll(sql);
    for (let row of allHashsDB) {
      let hashs = row.adm_code;
      if (await hashCompare(code, hashs)) {
        admin = row.adm_id;
        dialog.showMessageBoxSync(promptWindow, {
          title: 'Acesso Concedido',
          message: `Bem vindo ${row.adm_name}`,
        });
        promptWindow.close();
        mainWindow.close();
        createAllWindows.createRegisterWindow();
        return;
      }
    }
    return dialog.showErrorBox('Negado', 'Chave de Acesso Inválida ou Expirada');
  } catch (e) {
    console.error('Ocorre um erro', e);
  }
});
// Capture Form-Register
ipcMain.on('form-register', async (event, args) => {
  try {
    sql = 'INSERT INTO Controlador (ctr_usu, ctr_nome, ctr_sbnome, ctr_senha, ctr_created_by) VALUES (?, ?, ?, ?, ?)';
    const hashPassword = await createdHash(args.password, 10);
    const row = await Store(sql, [args.user, args.name, args.lastname, hashPassword, admin]);
    if (!row) return dialog.showErrorBox('Não foi possível cadastrar', 'Usuário já existe');
    
    dialog.showMessageBoxSync(registerWindow, {
      title: 'Sucesso',
      message: 'Usuário cadastrado com êxito!',
    });
    registerWindow.close();
    createAllWindows.createLoginWindow();
  } catch (e) {
    console.log(e);
  }
});

//Event-in-the-Pages
//After clicking the link, to go the registration page (LoginPage)
ipcMain.on('open-prompt', (event) => {
  createAllWindows.createPromptWindow();
  promptWindow.once('ready-to-show', () => {
    promptWindow.show();
  });
});
//if the access code is wrong
ipcMain.on('block-prompt', (event) => {
  dialog.showErrorBox('Acesso Negado', 'Sua sessão será encerrada');
  app.quit();
});
//After clicking submit and the fields are wrong (Universal)
ipcMain.on('camp-error', (event) => { //
  dialog.showErrorBox('Atenção', 'Corrija os campos necessários');
})
//Before CLICK in Back, to back for LoginPage (RegisterPage)
ipcMain.on('go-back', (event) => {
  registerWindow.close();
  createAllWindows.createLoginWindow();
});
