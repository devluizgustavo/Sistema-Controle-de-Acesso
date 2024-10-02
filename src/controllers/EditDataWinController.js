const { dialog } = require('electron');
const editDataWinModel = require('../models/EditDataWinModel.js');

async function EditDataController(id) {
  try {
    const dataModel = new editDataWinModel(id);

    await dataModel.initData();

    let string = 'Confira os campos abaixo:\n\n';
    dataModel.errors.forEach(val => string += val);

    if (dataModel.errors.length > 0) {
      dialog.showErrorBox('Não foi possível acessar a janela de edição de dados', `\n${string}`);
      return false;
    }

    return dataModel.record;
  } catch (e) {
    console.error('Erro na tentativa de enviar os dados:', e);
  }
}

module.exports = EditDataController