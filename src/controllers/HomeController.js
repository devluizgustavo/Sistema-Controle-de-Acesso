const { dialog } = require('electron');
const { FindAll } = require('../util/dbRepository.js')
const { checkedLoggedIn } = require('../middlewares/globalMiddleware.js');
const windowManager = require('../../windows.js');

/*

Funções da HOME FAZER

Sair da sessão ( OK )
Abrir a Janela de Cadastros de Pessoas ( OK )
Abrir a Janela de Liberação de Pessoas ( OK )
Abrir a Janela de Historico de Cadastros ( PENDENTE )
Manipular a Tabela de Pessoas

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
        message: 'Nenhum acesso foi selecionado'
      });
      return false;
    }

    windowManager.createReleaseAccessWindow();
    return true;
  } catch (e) {
    console.error('Erro ao tentar abrir a janela de acesso', e);
  }
}

module.exports = {
  closeSession,
  openWinRegisterPerson,
  openWinAccessRelease
}