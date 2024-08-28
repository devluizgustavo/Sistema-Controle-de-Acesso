const { dialog } = require('electron');
const { FindAll } = require('../util/dbRepository.js')
const PersonRegistrationModel = require('../models/PersonRegistrationModel.js');

async function registerPersonController(args, ctr_id) {
  try {
    const registro = new PersonRegistrationModel(args, ctr_id);
    await registro.initCadastro();

    let string = 'Confira os campos abaixo:\n';

    registro.errors.forEach((val) => { string += val });
    if (registro.errors.length > 0) {
      return dialog.showErrorBox('Cadastro não realizado', `\n${string}`);
    }

    await dialog.showMessageBox(global.registerPeopleWindow, {
      type: 'info',
      title: 'Atenção',
      message: 'Cadastro realizado com sucesso\n',
    });

    return true;
  } catch (e) {
    console.error('Erro ao criar o cadastro', e);
  }
}

module.exports = registerPersonController;