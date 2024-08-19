const { dialog } = require('electron');
const FormPeopleModel = require('../models/PeopleCadModel.js');

async function peopleCadController(args, ctr_id) {
  try {
    const registro = new FormPeopleModel(args, ctr_id);
    await registro.initCadastro();

    let string = 'Confira os campos abaixo:\n';

    registro.errors.forEach((val) => { string += val });
    if (registro.errors.length > 0) {
      return dialog.showErrorBox('Cadastro não realizado', `\n${string}`);
    }

    return dialog.showMessageBox(global.registerPeopleWindow, {
      type: 'info',
      title: 'Cadastrado',
      message: 'Cadastro realizado com sucesso',
      buttons: ['Continuar'],
    });
  } catch (e) {
    console.log('Erro ao criar o cadastro', e);
  }
}

module.exports = peopleCadController