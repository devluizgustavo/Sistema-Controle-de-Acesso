const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { FindAll, Create, FindOne } = require('./src/util/dbRepository.js');
const { hashCompare, createdHash } = require('./src/util/bcryptFunc.js');
const peopleCadController = require('./src/controllers/peopleCadController.js');
const loginController = require('./src/controllers/loginController.js');
const registerController = require('./src/controllers/registerController.js');
const { checkedAuthCode } = require('./src/middlewares/globalMiddleware.js');

global.mainWindow = null;
global.promptWindow = null;
global.registerWindow = null;
global.controllerWindow = null;
global.registerPeopleWindow = null;

let admin = null;
let user = null;


class createAllWindows {
  static createAuthPromptWindow() {
    global.promptWindow = new BrowserWindow({
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
    global.mainWindow = new BrowserWindow({
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
    mainWindow.webContents.openDevTools(true);
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'loginPage.html'));
  }

  static createRegisterWindow() {
    global.registerWindow = new BrowserWindow({
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
    global.controllerWindow = new BrowserWindow({
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
    controllerWindow.webContents.openDevTools(true);
    controllerWindow.setMenuBarVisibility(false);
    controllerWindow.loadFile(path.join(__dirname, 'renderer', 'pages', 'controllerPage.html'));
  }

  static createRegisterPeopleWindow() {
    global.registerPeopleWindow = new BrowserWindow({
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

//     VERIFICAÇÃO DOS FORMULÁRIOS ENVIADOS
//Checagem de login no sistema
ipcMain.handle('form-login', async (event, args) => {
  try {
    const loginOn = await loginController(args);
    if (!loginOn) return false;

    user = loginOn
    return true;
  } catch (e) {
    console.error('Erro ao tentar efetuar o login:', e);
  }
});

//Chegagem de registro no sistema
ipcMain.handle('form-register', async (event, args) => {
  try {
    const newUser = await registerController(args, admin.adm_id);
    if (!newUser) return false;

    return true;
  } catch (e) {
    console.error('Erro ao tentar cadastrar:', e);
  }
});

//Checagem do codigo de acesso para acessar partes restritas do sistema
ipcMain.handle('auth-required', async (event, args) => {
  try {
    const adminChecked = await checkedAuthCode(args);
    if (!adminChecked) return false;

    admin = adminChecked;
    return true;
  } catch (e) {
    console.error('Erro ao validar a chave de acesso', e);
  }
});

//Chegagem do cadastro da pessoa no sistema
ipcMain.handle('form-cad-peoples', async (event, args) => {
  try {
    const peopleCad = await peopleCadController(args, user.ctr_id)
    if (!peopleCad) return false;

    return true;
  } catch (e) {
    console.error('Erro ao tentar cadastrar:', e);
  }
});

//         EVENTOS NAS PÁGINAS

//          PAGINA DE LOGIN
//Caso o login for bem-sucedido
ipcMain.on('success-login', async () => {
  await dialog.showMessageBox(global.mainWindow, {
    type: 'info',
    title: 'Sucesso',
    message: 'Login efetuado\nClique em continuar para acessar o sistema',
    buttons: ['Continuar']
  });
  mainWindow.close();
  createAllWindows.createControllerWindow()
});
//Abrir a página para digitar o codigo de acesso
ipcMain.on('open-prompt', (event) => {
  createAllWindows.createAuthPromptWindow()
  promptWindow.once('ready-to-show', () => {
    promptWindow.show();
  });
});

//   PAGINA DE AUTENTICAÇÃO DO CODIGO
//Caso a checagem for bem-sucedida
ipcMain.on('success-auth', () => {
  dialog.showMessageBoxSync(promptWindow, {
    title: 'Acesso Concedido',
    message: `Bem vindo ${admin.adm_name}`,
  });
  promptWindow.close();
  mainWindow.close();
  createAllWindows.createRegisterWindow();
});
//Caso o código de acesso estiver incorreto
ipcMain.on('block-prompt', () => {
  dialog.showErrorBox('Acesso Negado', 'Sua sessão será encerrada');
  app.quit();
});

//          PAGINA DE REGISTRO
//Caso a checagem do registro for bem-sucedida
ipcMain.on('success-register', () => {
  dialog.showMessageBoxSync(registerWindow, {
    title: 'Sucesso',
    message: 'Usuário cadastrado com êxito!',
  });
  registerWindow.close();
  createAllWindows.createLoginWindow();
});
//Voltar para página de Login
ipcMain.on('go-back', () => {
  registerWindow.close();
  createAllWindows.createLoginWindow();
});

//    PAGINA DE CONTROLE DE CADASTROS
//Abrir janela de cadastro de pessoas
ipcMain.on('click-btn-cad', async () => {
  try {
  await createAllWindows.createRegisterPeopleWindow();
  } catch(e) {
    console.error('Erro ao criar a janela de cadastro', e);
  }
 
});
//Encerrar a sessão
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
      }
    });
  } catch (e) {
    console.log(e);
  }
});
//Voltar para a pagina de controle
ipcMain.on('back-to-controller', () => {
  registerPeopleWindow.close();
});

//         EVENTOS REUTILIZAVEIS
// Mandar os dados do usuário sempre que solicitado
ipcMain.handle('get-user', () => { return user; });