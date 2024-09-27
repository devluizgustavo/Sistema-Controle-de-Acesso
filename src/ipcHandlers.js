const { ipcMain, dialog, app } = require('electron');

// Controladores da HOME
const { closeSession, openWinRegisterPerson, openWinAccessRelease, findRecordsByInput,
  openWinHistoryAccess } = require('./controllers/HomeController.js');

// Controladores Gerais
const UserLoginController = require('./controllers/UserLoginController.js');
const LogHistoryController = require('./controllers/LogHistoryController.js');
const UserRegisterController = require('./controllers/UserRegisterController.js');
const RealeaseAccessController = require('./controllers/RealeaseAccessController.js');
const PersonRegistrationController = require('./controllers/PersonRegistrationController.js');

// Middlewares
const { checkedAuthCode } = require('./middlewares/globalMiddleware.js');

// Utilidades 
const getAssuntos = require('./util/getAssuntos');
const getAccessInBuildingAccess = require('./util/getAccessInBuildingAccess.js');
const getRecordsNotInBuildingAccess = require('./util/getRecordsNotInBuildingAccess');

global.user = null;
global.admin = null;
global.allAccessInSystem = null;
global.allLogsByID = null;

let idAccessClick = null;
let logsByID = null;
const windowManager = require('../windows.js');

module.exports = function setupIPCHandlers() {
  // Responsável por chamar o Controller do Login
  ipcMain.handle('form-login', async (event, args) => {
    try {
      const loginOn = await UserLoginController(args);
      if (!loginOn) return false;

      global.user = loginOn;

      await dialog.showMessageBox(windowManager.loginWindow, {
        type: 'info',
        title: 'Sucesso',
        message: 'Login efetuado\nClique em continuar para acessar o sistema',
        buttons: ['Continuar'],
      });

      windowManager.loginWindow.close();
      windowManager.createHomeWindow();

      return true;
    } catch (e) {
      console.error('Erro ao tentar efetuar o login:', e);
    }
  });

  // Responsável por chamar o Controller de Registro
  ipcMain.handle('form-register', async (event, args) => {
    try {
      const newUser = await UserRegisterController(args, global.admin?.adm_id);
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
      const peopleCad = await PersonRegistrationController(args, global.user?.ctr_id);
      if (peopleCad) {
        windowManager.registerPeopleWindow.close();
        //Sinal dizendo ao front-end que atualize a tabela 
        windowManager.homeWindow.webContents.send('updateTable');
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
  ipcMain.on('click-btn-cad', async (e) => {
    e.preventDefault();
    await openWinRegisterPerson();
  });

  // Responsável por sair da sessão atual
  ipcMain.on('close-session', async (event) => {
    event.preventDefault();
    await closeSession();
  });

  // Responsável por voltar para a página de controle de acesso
  ipcMain.on('back-to-controller', () => {
    windowManager.registerPeopleWindow.close();
  });

  //Responsável por abrir a janela de liberação de acesso
  ipcMain.on('open-win-access-realease', async (event, id) => {
    event.preventDefault();
    const win = await openWinAccessRelease(id);
    if (!win) return;
    idAccessClick = id;
  });

  // Responsável por abrir a janela do histórico de acesso de um usuário específicio
  ipcMain.on('open-win-history-access', async (event, id) => {
    event.preventDefault();

    const res = await LogHistoryController(id);
    if (!res) return;

    await openWinHistoryAccess(id);

    windowManager.homeWindow.webContents.send('allLogsByID', res);

    logsByID = res;
  });

  // Responsável por trazer os dados do usuário atual para o front-end
  ipcMain.handle('get-user', () => {
    return global.user;
  });

  // Responsável por trazer assuntos de determinado departamento
  ipcMain.handle('get-assunto-depto', async (event, args) => {
    event.preventDefault();
    if (!args) dialog.showMessageBox(windowManager.releaseAccessWindow, {
      type: 'warning',
      title: 'Atenção',
      message: 'Você precisa escolher uma das opções'
    });

    const assuntosInDepto = await getAssuntos(args);
    return assuntosInDepto;
  });

  // Responsável por liberar o acesso de pessoas
  ipcMain.handle('set-historico-access', async (event, deptoAndAssunto) => {
    event.preventDefault();
    if (!deptoAndAssunto) return false;
    const setAccess = await RealeaseAccessController(deptoAndAssunto, idAccessClick);
    if (!setAccess) return false;

    return true;
  });

  // Responsável por trazer todos os ultimos acessos 
  ipcMain.handle('get-all-access', async () => {
    const getAccess = await getAccessInBuildingAccess();
    const getRecords = await getRecordsNotInBuildingAccess();

    const combinateArray = getAccess.concat(getRecords);

    global.allAccessInSystem = combinateArray;

    return combinateArray;
  });

  // Responsável por trazer todos os dados que sejam semelhantes com a pesquisa do usuário
  ipcMain.handle('find-records-by-search', async (event, args) => {
    event.preventDefault();
    const RecordsFound = await findRecordsByInput(args);
    return RecordsFound;
  });

  // Responsável por enviar todos os logs do cadastro no sistema
  ipcMain.handle('send-all-logs', async () => {
    return logsByID;
  })

}