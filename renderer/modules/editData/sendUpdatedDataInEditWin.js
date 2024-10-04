import validateUpdatedData from "./validateUpdatedData";

export default async function sendUpdatedDataInEditWin() {
  try {
    const input = document.querySelector('#editPage').querySelectorAll('input');
    const btnSend = document.querySelector('#btnSendInEditPage');

    const objData = {};

    let keys = ['name', 'lastname', 'dtnasc', 'cpf', 'rg', 'tel', 'email'];
    let values = [];

    btnSend.addEventListener('click', e => {
      e.preventDefault();

      values = [];

      input.forEach(input => {
        input.removeAttribute('disabled');
        input.style.background = 'transparent';
        values.push(input.value);
      })

      for (let i = 0; i < keys.length; i++) {
        objData[keys[i]] = values[i];
      }

      if (validateUpdatedData(objData)) {
        await window.electron.updatedDataByEditWin(objData);
      };
    })

  } catch (e) {
    console.error('Erro ao efetuar o envio dos novos dados para o back-end:', e);
  }
}