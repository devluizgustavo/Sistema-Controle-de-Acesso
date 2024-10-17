const { dialog } = require('electron');
const { GetDataModel, UpdateDataModel, DeleteDataModel } = require('../models/EditDataWinModel.js');

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

async function ValidateAndDeleteCadastro(dataCad) {
  try {
    const deleteDtModel = new DeleteDataModel(dataCad.cad_id);

    await deleteDtModel.initDeleted();

    let string = 'Confira os campos abaixo:\n\n';
    deleteDtModel.errors.forEach(val => string += val);

    if (deleteDtModel.errors.length > 0) {
      dialog.showErrorBox('Não foi possível deletar o cadastro', `\n${string}`);
      return;
    }

    if (!deleteDtModel.isDeleted) return false;

    return deleteDtModel.isDeleted;
  } catch(e) {
    console.error('Erro na tentativa de deletar o cadastro', e);
  }
}

module.exports = { GetDataByID, ValidateAndUpdateRegister, ValidateAndDeleteCadastro };