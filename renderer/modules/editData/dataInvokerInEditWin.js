import invokeDataInInputs from "./invokeDataInInputs";

export default async function dataInvokerInEditWin() {
  try {
    const dataByID = await window.electron.getOneData();

    await invokeDataInInputs(dataByID);
  } catch (e) {
    console.error('Erro ao tentar trazer os dados do registro:', e);
  }
}