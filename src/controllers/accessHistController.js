const { dialog } = require('electron');
const AccessModel = require('../models/AccessModel.js');

async function accessHistController(deptoAndAssunto, lastAccessCad) {
  try {
    if (!deptoAndAssunto || !lastAccessCad) return;

    const getAccess = new AccessModel(deptoAndAssunto, lastAccessCad);
    await getAccess.initAccess();

    let string = 'Confira os campos abaixo:\n';
    getAccess.errors.forEach(val => string += val);

    if (getAccess.errors.length > 0) {
      return dialog.showErrorBox('Acesso não liberado', `\n${string}`);
    }

    return getAccess.accessIsTrue;
  } catch(e) {
    console.error('Erro ao tentar armazenar o histórico');
  }
}

module.exports = accessHistController;
