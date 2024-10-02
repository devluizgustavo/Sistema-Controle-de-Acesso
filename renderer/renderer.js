// Importar módulos
import initClickListeners from './utils/initClickListeners.js';
import initFormListeners from './utils/initFormListeners.js';
import initInputListeners from './utils/initInputListeners.js';
import initInputMasks from './utils/initInputMasks.js';
import funcInitInput from './modules/homePage/InputSearchPeoples.js';
import invokeAssuntosInInput from './modules/realeaseAccess/invokeAssuntosInInput.js'
import invokeAllAccessInTable from './modules/homePage/invokeAllAccessInTable';
import initTypeIdentChange from './utils/initTypeIdentChange.js';
import showNameUser from './utils/showNameUser.js';
import getAccessByClickInRow from './modules/homePage/getAccessByClickInRow.js';
import dataInvokerInHistory from './modules/historyAccess/dataInvokerInHistory';
import dataInvokerInEditWin from './modules/editData/dataInvokerInEditWin.js';
import activateInputOnClick from './modules/editData/activateInputOnClick.js'

// Função principal de inicialização
async function init() {
  await new Promise(resolve => window.addEventListener('DOMContentLoaded', resolve));

  // Configura o listener para atualizações da tabela
  window.electron.on('updateTable', async () => {
    await invokeAllAccessInTable();
  });

  // Executa funções que podem rodar em paralelo
  await Promise.all([
    activateInputOnClick(),
    dataInvokerInEditWin(),
    dataInvokerInHistory(),
    invokeAssuntosInInput(),
    initTypeIdentChange(),
    initFormListeners(),
    funcInitInput(),
    initClickListeners(),
    showNameUser(),
    initInputMasks(),
    getAccessByClickInRow(),
    invokeAllAccessInTable(),
    initInputListeners()
  ]);
}

// Executa a função principal de inicialização
init();
