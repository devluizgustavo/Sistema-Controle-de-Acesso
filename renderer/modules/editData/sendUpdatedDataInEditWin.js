import validateUpdatedData from "./validateUpdatedData";

export default async function sendUpdatedDataInEditWin() {
  try {
    const input = document.querySelector('#editPage').querySelectorAll('input');
    const btnSend = document.querySelector('#btnSendInEditPage');
    const btnDelete = document.querySelector('#btnDeleteInEditPage');
    const getID = await window.electron.getOneData();

    const objData = {};

    let keys = ['name', 'lastname', 'dtnasc', 'cpf', 'rg', 'tel', 'email', 'id'];
    let values = [];

    //Solicitação caso o botão clicado seja de edição dos dados
    btnSend.addEventListener('click', async (e) => {
      e.preventDefault();

      values = [];

      input.forEach(input => {
        input.removeAttribute('disabled');
        input.style.background = 'transparent';
        values.push(input.value);
      })

      values.push(getID.cad_id);

      for (let i = 0; i < keys.length; i++) {
        objData[keys[i]] = values[i];
      }

      if (validateUpdatedData(objData)) {
        await window.electron.updatedDataByEditWin(objData);
      };
    });

    //Solicitação caso o botão clicado seja o de excluir os dados
    btnDelete.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!getID) return;
      await window.electron.deletedDataByEditWin(getID);      
    })


  } catch (e) {
    console.error('Erro ao efetuar o envio dos novos dados para o back-end:', e);
  }
}

