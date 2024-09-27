import invokeNameAndId from "./invokeNameAndId.js";
import invokeAccessCounter from "./invokeAccessCounter.js";
import invokeRowInTable from "./invokeRowInTable.js";

export default async function dataInvokeInHistory() {
  try {
    const logs = await window.electron.getAllLogsByID();
    await invokeNameAndId(logs);
    await invokeAccessCounter(logs);
    await invokeRowInTable(logs);
  } catch (e) {
    console.error('Erro ao tentar mostrar os dados de acesso: ', e);
  }

}