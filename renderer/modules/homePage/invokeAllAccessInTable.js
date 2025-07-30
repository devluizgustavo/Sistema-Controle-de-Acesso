import createRowInTable from './funcCreateRow.js';
import initTableRowSelection from './initTableRowSelection.js'
//Fazer uma requisição de todos os dados dos registros


async function invokeAllAccessInTable() {
  try {
    const filter = document.querySelector('#filter');

    const allAccess = await window.electron.getAllAccess(filter.value);
    createRowInTable(allAccess);
    initTableRowSelection();
    
    filter.addEventListener('input', async (e) => {
      const allAccess = await window.electron.getAllAccess(filter.value);
      createRowInTable(allAccess);
      initTableRowSelection();
    });
  } catch (e) {
    console.error('Erro ao tentar mostrar os dados na pagina principal: ', e);
  }
}


export default invokeAllAccessInTable;