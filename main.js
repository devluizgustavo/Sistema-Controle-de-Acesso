const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { FindAll, Store, FindOne } = require('./src/util/dbRepository.js');
const { hashCompare, createdHash } = require('./src/bcrypt/bcryptFunc.js');

let mainWindow = null;
let promptWindow = null;
let registerWindow = null;
let controllerWindow = null;
let registerPeopleWindow = null;

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
      parent: mainWindow,
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

    promptWindow.once('ready-to-show', () => {
      promptWindow.show();
    })

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


    registerWindow.once('ready-to-show', () => {
      registerWindow.show();
    })

    registerWindow.maximize();
    registerWindow.setMenuBarVisibility(false);
    // registerWindow.webContents.openDevTools(true);
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

    controllerWindow.once('ready-to-show', () => {
      controllerWindow.show();
    })

    // controllerWindow.once('close', async (event) => {
    //   try {
    //     event.preventDefault();
    //     await dialog.showMessageBox(controllerWindow, {      
    //       type: 'warning',
    //       title: 'Atenção',
    //       message: 'Tem certeza que deseja encerrar a aplicação?',
    //       buttons: ['Cancelar', 'Confirmar'],
    //       defaultId: 1,
    //     }).then((val) => {
    //       console.log(val.response)
    //       if (val.response === 1) {
    //         controllerWindow.close();
    //       }
    //     });
    //   } catch (e) {
    //     console.error(e);
    //   }
    // });

    controllerWindow.maximize();
    // controllerWindow.webContents.openDevTools(true);
    controllerWindow.setMenuBarVisibility(false);
    controllerWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'controllerPage.html'));
  }

  static createRegisterPeopleWindow() {
    registerPeopleWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: path.join(__dirname, 'assets', 'img', 'icons', 'iconApp', '512x512.png'),
      title: 'App Controle',
      modal: true,
      frame: false,
      transparent: true,
      parent: controllerWindow,
      show: false,
      center: true,
      resizable: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
      },
    });

    registerPeopleWindow.once('ready-to-show', () => {
      registerPeopleWindow.show();
    });
    registerPeopleWindow.webContents.openDevTools(true);
    registerPeopleWindow.setMenuBarVisibility(false);
    registerPeopleWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'registerPeoplePage.html'));
  }
}

app.whenReady().then(() => {
  createAllWindows.createLoginWindow();
});

// LOGIN PAGE EVENTS
//Checking Login
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
//If the login is correct
ipcMain.on('success-login', () => {
  dialog.showMessageBoxSync(mainWindow, {
    title: 'Login feito com sucesso',
    message: `Sua sessão será iniciada`
  });
  mainWindow.close();
  createAllWindows.createControllerWindow()
});
//Open prompt for code-access
ipcMain.on('open-prompt', (event) => {
  createAllWindows.createAuthPromptWindow()
  promptWindow.once('ready-to-show', () => {
    promptWindow.show();
  });
});
// Get User From Renderer
ipcMain.handle('get-user', async (event) => {
  try {
    const res = await user;
    return res;
  } catch (e) {
    console.log(e);
  }
});

//PROMPT AUTH EVENTS
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
//If the access code is correct
ipcMain.on('success-auth', () => {
  dialog.showMessageBoxSync(promptWindow, {
    title: 'Acesso Concedido',
    message: `Bem vindo ${admin.adm_name}`,
  });
  promptWindow.close();
  mainWindow.close();
  createAllWindows.createRegisterWindow();
});
//if access code is wrong
ipcMain.on('block-prompt', () => {
  dialog.showErrorBox('Acesso Negado', 'Sua sessão será encerrada');
  app.quit();
});

//REGISTER PAGE EVENTS
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
//If the register is correct
ipcMain.on('success-register', () => {
  dialog.showMessageBoxSync(registerWindow, {
    title: 'Sucesso',
    message: 'Usuário cadastrado com êxito!',
  });
  registerWindow.close();
  createAllWindows.createLoginWindow();
});
//Back for LoginPage (RegisterPage)
ipcMain.on('go-back', () => {
  registerWindow.close();
  createAllWindows.createLoginWindow();
});

//CONTROLLER PAGE EVENTS
//Open Window for Register People in DB
ipcMain.on('click-btn-cad', () => {
  createAllWindows.createRegisterPeopleWindow();
});
//Close the session
ipcMain.on('close-session', async (event) => {
  try {
    event.preventDefault();
    await dialog.showMessageBox(controllerWindow, {
      type: 'warning',
      buttons: ["Cancelar", "Encerrar"],
      defaultId: 1,
      title: "Confirmar",
      message: "Você realmente deseja encerrar a sessão?",
    }).then((val) => {
      if (val.response === 1) {
        user = null;
        controllerWindow.close();
        createAllWindows.createLoginWindow();
        dialog.showMessageBox(mainWindow, {
          title: 'Atenção',
          message: 'Sua sessão foi encerrada'
        })
      }
    });
  } catch (e) {
    console.log(e);
  }
});
//Back to Controller Page
ipcMain.on('back-to-controller', () => {
  registerPeopleWindow.close();
});
