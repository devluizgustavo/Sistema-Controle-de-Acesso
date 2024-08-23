const { ipcMain, dialog, app } = require('electron');
const { registerPeople, getAssunto } = require('./controllers/mainController.js');
const loginController = require('./controllers/loginController.js');
const registerController = require('./controllers/registerController.js');
const { checkedAuthCode, checkedLoggedIn } = require('./middlewares/globalMiddleware.js');
const accessHistController = require('./controllers/accessHistController.js');
const windowManager = require('../windows.js');

global.user = null;
global.admin = null;

let lastRegisterPeople = null;

module.exports = function setupIPCHandlers() {
  // Responsável por chamar o Controller do Login
  ipcMain.handle('form-login', async (event, args) => {
    try {
      const loginOn = await loginController(args);
      if (!loginOn) return false;

      global.user = loginOn;

      await dialog.showMessageBox(windowManager.mainWindow, {
        type: 'info',
        title: 'Sucesso',
        message: 'Login efetuado\nClique em continuar para acessar o sistema',
        buttons: ['Continuar'],
      });

      windowManager.mainWindow.close();
      windowManager.createControllerWindow();

      return true;
    } catch (e) {
      console.error('Erro ao tentar efetuar o login:', e);
    }
  });

  // Responsável por chamar o Controller de Registro
  ipcMain.handle('form-register', async (event, args) => {
    try {
      const newUser = await registerController(args, global.admin?.adm_id);
      if (!newUser) return false;

      await dialog.showMessageBox(windowManager.registerWindow, {
        title: 'Sucesso',
        message: 'Usuário cadastrado com êxito!',
      });

      windowManager.registerWindow.close();
      windowManager.createLoginWindow();

      return true;
    } catch (e) {
      console.error('Erro ao tentar cadastrar:', e);
    }
  });

  // Responsável chamar o Middleware da Chave de Acesso
  ipcMain.handle('auth-required', async (event, args) => {
    try {
      const adminChecked = await checkedAuthCode(args);
      if (!adminChecked) return false;

      global.admin = adminChecked;

      await dialog.showMessageBox(windowManager.promptWindow, {
        title: 'Acesso Concedido',
        message: `Bem vindo ${global.admin.adm_name}`,
      });
      windowManager.promptWindow.close();
      windowManager.createRegisterWindow();

      return true;
    } catch (e) {
      console.error('Erro ao validar a chave de acesso', e);
    }
  });

  // Responsável por chamar o Controller do cadastro de pessoas ao prédio
  ipcMain.handle('form-cad-peoples', async (event, args) => {
    try {
      const peopleCad = await registerPeople(args, global.user?.ctr_id);
      if (peopleCad) {
        windowManager.registerPeopleWindow.close();
        windowManager.createReleaseAccessWindow();
        lastRegisterPeople = { rg: args.rg, cpf: args.cpf }
        return true;
      }

      return false;
    } catch (e) {
      console.error('Erro ao tentar cadastrar:', e);
    }
  });

  // Responsável por abrir a janela de código de acesso
  ipcMain.on('open-prompt', () => {
    windowManager.createAuthPromptWindow();
  });

  // Caso a chave de acesso esteja inválida
  ipcMain.on('block-prompt', () => {
    dialog.showErrorBox('Acesso Negado', 'Sua sessão será encerrada');
    app.quit();
  });

  // Responsável por voltar para a pagina de login
  ipcMain.on('go-back', () => {
    windowManager.registerWindow.close();
    windowManager.createLoginWindow();
  });

  // Responsável por abrir a janela de Cadastro de Pessoas
  ipcMain.on('click-btn-cad', async () => {
    try {
      const isLogged = await checkedLoggedIn(); //Middleware
      if (!isLogged) return;
      windowManager.createRegisterPeopleWindow();
    } catch (e) {
      console.error('Erro ao criar a janela de cadastro', e);
    }
  });

  // Responsável por sair da sessão atual
  ipcMain.on('close-session', async (event) => {
    try {
      event.preventDefault();
      await dialog.showMessageBox(windowManager.controllerWindow, {
        type: 'warning',
        buttons: ["Cancelar", "Encerrar"],
        defaultId: 1,
        title: "Confirmar",
        message: "Você realmente deseja encerrar a sessão?",
      }).then((val) => {
        if (val.response === 1) {
          global.user = null;
          windowManager.controllerWindow.close();
          windowManager.createLoginWindow();
        }
      });
    } catch (e) {
      console.error('Erro ao encerrar a sessão', e);
    }
  });

  // Responsável por voltar para a página de controle de acesso
  ipcMain.on('back-to-controller', () => {
    windowManager.registerPeopleWindow.close();
  });

  // Responsável por trazer os dados do usuário atual para o front-end
  ipcMain.handle('get-user', () => {
    return global.user;
  });

  // Responsável por trazer assuntos de determinado departamento
  ipcMain.handle('get-assunto-depto', async (event, args) => {
    try {
      event.preventDefault();
      if (!args) dialog.showMessageBox(windowManager.releaseAccessWindow, {
        type: 'warning',
        title: 'Atenção',
        message: 'Você precisa escolher uma das opções'
      });

      const assuntosInDepto = await getAssunto(args);

      return assuntosInDepto;
    } catch (e) {
      console.error('Erro ao tentar trazer os dados do assunto', e);
    }
  });

  // Responsável por liberar o acesso de pessoas
  ipcMain.handle('set-historico-access', async (event, deptoAndAssunto) => {
    event.preventDefault();
    const setAccess = await accessHistController(deptoAndAssunto, lastRegisterPeople);
    if (!setAccess) return false;

    await dialog.showMessageBox(windowManager.releaseAccessWindow, {
      type: 'info',
      title: 'Atenção',
      message: `Acesso Concedido`,
    });

    windowManager.releaseAccessWindow.close();

    return true;
  })

  
}