// Importar módulos
import initClickListeners from './utils/initClickListeners.js';
import initFormListeners from './utils/initFormListeners.js';
import initInputListeners from './utils/initInputListeners.js';
import initInputMasks from './utils/initInputMasks.js';
import invokeAssuntosInInput from './modules/realeaseAccess/invokeAssuntos.js'
import initTableRowSelection from './utils/initTableRowSelection.js';
import initTypeIdentChange from './utils/initTypeIdentChange.js';
// import invokeRegisterInTable from './modules/mainController/invokeRegisterInTable.js';
import showNameUser from './utils/showNameUser.js';

// Função principal de inicialização
function init() {
  window.addEventListener('DOMContentLoaded', () => {
    initClickListeners();
    invokeAssuntosInInput();
    initInputListeners();
    initFormListeners();
    showNameUser();
    initTableRowSelection();
    initTypeIdentChange();
    initInputMasks();
  });
}

// Executar a função principal de inicialização
init();
