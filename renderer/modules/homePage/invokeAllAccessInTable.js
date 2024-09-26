import createRowInTable from './funcCreateRow.js';
import initTableRowSelection from './initTableRowSelection.js'
//Fazer uma requisição de todos os dados dos registros


async function invokeAllAccessInTable() {
  try {
    const allAccess = await window.electron.getAllAccess();
    createRowInTable(allAccess)
    initTableRowSelection();
  } catch (e) {
    console.error('Erro ao tentar mostrar os dados na pagina principal', e);
  }
}


export default invokeAllAccessInTable;