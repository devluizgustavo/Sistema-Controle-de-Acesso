
const { dialog } = require('electron');
const LogHistoryModel = require('../models/LogHistoryModel.js');
const windowManager = require('../../windows.js');

async function LogHistoryController(id) {
  try {
    if (!id) return false;

    const LogUser = new LogHistoryModel(id);
    await LogUser.initLog();
    let string = 'Confira os campos abaixo:\n\n';
    LogUser.errors.forEach(val => string += val);

    if (LogUser.errors.length > 0) {
      dialog.showErrorBox('Não foi possível acessar o histórico', `\n${string}`);
      return false;
    }

    return LogUser.logUser;
  } catch (e) {
    console.error('Erro ao tentar localizar o histórico de acesso do registro:', e);
  }
}

module.exports = LogHistoryController;