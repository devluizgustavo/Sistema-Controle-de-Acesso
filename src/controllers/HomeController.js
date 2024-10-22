const { dialog } = require('electron');
const { checkedLoggedIn } = require('../middlewares/globalMiddleware.js');
const windowManager = require('../../windows.js');
const HomeModel = require('../models/HomeModel');

const getAccessInBuildingAccess = require('../util/getAccessInBuildingAccess.js');
const getRecordsNotInBuildingAccess = require('../util/getRecordsNotInBuildingAccess.js');
const getRecordsGrowingOrder = require('../util/getRecordsGrowingOrder.js');
const getRecordsDescendingOrder = require('../util/getRecordsDescendingOrder.js');


/*

Funções da HOME FAZER

{
Sair da sessão ( OK )
Abrir a Janela de Cadastros de Pessoas ( OK )
Abrir a Janela de Liberação de Pessoas ( OK )
Abrir a Janela de Historico de Cadastros ( OK )
Trazer registros conforme a pesquisa do usuário no INPUT ( OK )
Manipular a Tabela de Pessoas ( OK )
}

*/

async function closeSession() {
  try {
    await dialog.showMessageBox(windowManager.controllerWindow, {
      type: 'warning',
      buttons: ["Cancelar", "Encerrar"],
      defaultId: 1,
      title: "Confirmar",
      message: "Você realmente deseja encerrar a sessão?",
    }).then((val) => {
      if (val.response === 1) {
        global.user = null;
        console.log(global.user);
        windowManager.homeWindow.close();
        windowManager.createLoginWindow();
      }
    });
  } catch (e) {
    console.error('Erro ao encerrar a sessão', e);
  }
}

async function openWinRegisterPerson() {
  try {
    const isLogged = await checkedLoggedIn(); //Middleware
    if (isLogged) return;
    windowManager.createRegisterPeopleWindow();
    windowManager.homeWindow.webContents.reload();
  } catch (e) {
    console.error('Erro ao criar a janela de cadastro', e);
  }
}

async function openWinAccessRelease(id) {
  try {
    const isLogged = await checkedLoggedIn();
    if (isLogged) return;
    if (!id) {
      dialog.showMessageBox(windowManager.homeWindow, {
        type: 'warning',
        title: 'Atenção',
        message: 'Nenhum registro foi selecionado'
      });
      return false;
    }

    windowManager.createReleaseAccessWindow();
    windowManager.homeWindow.webContents.reload();
    return true;
  } catch (e) {
    console.error('Erro ao tentar abrir a janela de acesso:', e);
  }
}

async function openWinHistoryAccess(id) {
  try {
    const isLogged = await checkedLoggedIn();
    if (isLogged) return;
    
    windowManager.createAccessHistoryLogWindow();
    windowManager.homeWindow.webContents.reload();
  } catch (e) {
    console.error('Erro ao tentar abrir a janela de histórico de acesso:', e);
  }

}

async function findRecordsByInput(args) {
  try {
    const findRecords = new HomeModel(args);
    const records = await findRecords.initSearch();

    if (!records) return false;

    return findRecords.recordsFoundByID;
  } catch (e) {
    console.error('Erro ao tentar encontrar os registros:', e);
  }
}

async function setAccessByFilter(filter){
  try {
    const getInAccess = await getAccessInBuildingAccess();
    const getDontAccess = await getRecordsNotInBuildingAccess();
    const getAll = getInAccess.concat(getDontAccess);
    const getGrowingOrder = await getRecordsGrowingOrder();
    const getDescendingOrder = await getRecordsDescendingOrder();
    
    if (filter == 'allDate') return getAll;
    if (filter == 'notAccess') return getDontAccess;
    if (filter == 'recentDate') return getInAccess;
    if (filter == 'growing') return getGrowingOrder;
    if (filter == 'descending') return getDescendingOrder;

  } catch(e) {
    console.error('Erro ao tentar efetuar a filtragem:', e);
  }
}

module.exports = {
  setAccessByFilter,
  closeSession,
  openWinRegisterPerson,
  openWinAccessRelease,
  findRecordsByInput,
  openWinHistoryAccess,
}