const { ipcMain, dialog, app } = require('electron');

// Controladores da HOME
const { 
  closeSession, 
  openWinRegisterPerson, 
  openWinAccessRelease, 
  findRecordsByInput, 
  openWinHistoryAccess,
  setAccessByFilter } = require('./controllers/HomeController.js');

// Controladores Gerais
const UserLoginController = require('./controllers/UserLoginController.js');
const LogHistoryController = require('./controllers/LogHistoryController.js');
const { GetDataByID, ValidateAndUpdateRegister, ValidateAndDeleteCadastro } = require('./controllers/EditDataWinController.js');
const UserRegisterController = require('./controllers/UserRegisterController.js');
const RealeaseAccessController = require('./controllers/RealeaseAccessController.js');
const PersonRegistrationController = require('./controllers/PersonRegistrationController.js');

// Middlewares
const { checkedAuthCode, checkedLoggedIn } = require('./middlewares/globalMiddleware.js');

// Utilidades 
const getAssuntos = require('./util/getAssuntos');

global.user = null;
global.admin = null;
global.allAccessInSystem = null;
global.allLogsByID = null;

let idAccessClick = null;
let logsByID = null;
let dataByID = null;
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

  // Responsável por voltar da pagina de cadastro de pessoas para a página de controle de acesso
  ipcMain.on('back-to-controller', () => {
    windowManager.registerPeopleWindow.close();
  });

  // Responsável por voltar da pagina de edição de dados para a página de controle de acesso
  ipcMain.on('close-edit-data-win', () => {
    windowManager.dataEditWindow.close();
  })

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

    if (!id) {
      return dialog.showMessageBox(windowManager.homeWindow, {
        type: 'warning',
        title: 'Atenção',
        message: 'Nenhum registro foi selecionado'
      });
    }

    const res = await LogHistoryController(id);
    if (!res) return;

    await openWinHistoryAccess(id);

    windowManager.homeWindow.webContents.send('allLogsByID', res);

    logsByID = res;
  });

  // Responsável por abrir a janela de Edição de Dados do Cadastro
  ipcMain.on('open-win-edit-data', async (event, id) => {
    event.preventDefault()

    if (!id) return dialog.showMessageBox(windowManager.dataEditWindow, {
      type: 'warning',
      title: 'Atenção',
      message: 'Nenhum registro foi selecionado'
    });

    const res = await GetDataByID(id);

    if (!res || await checkedLoggedIn()) return;

    windowManager.createEditDataWindow();
    windowManager.homeWindow.webContents.reload();
    dataByID = res;
  });

  // Responsável por enviar os dados do registro selecionado para a Página de Edição de Dados
  ipcMain.handle('get-data-by-id', async () => {
    return dataByID;
  })

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
  ipcMain.handle('get-all-access', async (event, filter) => {
    const getAccessByFilter = await setAccessByFilter(filter);
    return getAccessByFilter
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
  });

  // Responsável por tratar os dados, e atualizar conforme o ID selecionado
  ipcMain.handle('updated-data-by-id', async (event, dataUp) => {
    event.preventDefault();
    if (!dataUp) return;

    const setUpData = await ValidateAndUpdateRegister(dataUp)

    if (setUpData) {
      dialog.showMessageBox(windowManager.dataEditWindow, {
        type: 'info',
        title: 'Sucesso',
        message: 'Os dados foram editados'
      });

      windowManager.homeWindow.webContents.send('updateTable');
    }
  });

  // Responsável por excluir um cadastro, conforme o ID selecionado
  ipcMain.handle('deleted-data-by-id', async (event, id) => {
    event.preventDefault();
    if (!id) return

    dialog.showMessageBox(windowManager.dataEditWindow, {
      type: 'warning',
      title: 'Atenção',
      message: 'Você realmente deseja excluir esse cadastro?',
      detail: 'Essa ação será irreversível\n\nTodos os ACESSOS vínculados a ele serão APAGADOS',
      buttons: ['Cancelar', 'Excluir'],
      defaultId: 1,
    }).then(async (val) => {
      if (val.response === 1) {
        const checkDataAndDelete = await ValidateAndDeleteCadastro(id);  

        if (!checkDataAndDelete) return;

        dialog.showMessageBox(windowManager.dataEditWindow, {
          type: 'info',
          title: 'Sucesso',
          message: 'O cadastro foi excluido do sistema'
        }).then(val => {
          if (val) {
            windowManager.dataEditWindow.close(); 
            windowManager.homeWindow.webContents.send('updateTable');
          }
        })
      }
    })


  })

}