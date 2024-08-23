const { dialog } = require('electron');
const { FindAll } = require('../util/dbRepository.js')
const FormPeopleModel = require('../models/PeopleCadModel.js');

async function registerPeople(args, ctr_id) {
  try {
    const registro = new FormPeopleModel(args, ctr_id);
    await registro.initCadastro();

    let string = 'Confira os campos abaixo:\n';

    registro.errors.forEach((val) => { string += val });
    if (registro.errors.length > 0) {
      return dialog.showErrorBox('Cadastro não realizado', `\n${string}`);
    }

    const message = await dialog.showMessageBox(global.registerPeopleWindow, {
      type: 'info',
      title: 'Atenção',
      message: 'Cadastro realizado com sucesso\n\nDeseja liberar o acesso ao prédio?',
      buttons: ['Cancelar', 'Liberar Acesso'],
      defaultId: 1,
    }).then((val) => {
      if (val.response === 1) {
        return true
      } else {
        return false;
      }
    });

    return message;
  } catch (e) {
    console.error('Erro ao criar o cadastro', e);
  }
}

async function getAssunto(args) {
  try {
    if (typeof args !== 'number') return;

    const sql = 'SELECT ass_desc FROM Assuntos WHERE dep_id = ?';
    const assuntos = await FindAll(sql, args);

    const descAssuntos = assuntos.map((val) => val.ass_desc);

    return descAssuntos;
  } catch (e) {
    console.error('Erro ao tentar a conexão com a base de dados', e);
  }
}

module.exports = {
  registerPeople,
  getAssunto,
}