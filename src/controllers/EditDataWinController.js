const { dialog } = require('electron');
const { GetDataModel, UpdateDataModel } = require('../models/EditDataWinModel.js');

async function GetDataByID(id) {
  try {
    const dataModel = new GetDataModel(id);

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

async function ValidateAndUpdateRegister(dataUp) {
  try {
    const updateDtModel = new UpdateDataModel(dataUp);

    await updateDtModel.initUpdated();

    let string = 'Confira os campos abaixo:\n\n';
    updateDtModel.errors.forEach(val => string += val);

    if (updateDtModel.errors.length > 0) {
      dialog.showErrorBox('Não foi possível atualizar os dados', `\n${string}`);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Erro na tentiva de atualizar os dados do cadastro:', e);
  }
}

module.exports = { GetDataByID, ValidateAndUpdateRegister };