const { dialog } = require('electron');
const AuthModel = require('../models/AuthModel.js');

async function checkedAuthCode(args) {
  try {
    const authClass = new AuthModel(args);
    await authClass.initAuth();

    let string = `Confira o erro abaixo:\n${authClass.errors[0]}`;

    if (authClass.errors.length > 0) {
      return dialog.showErrorBox('Acesso Negado', `\n${string}`);
    }
    return authClass.admin;
  } catch (e) {
    console.error('Erro ao iniciar a verificação da chave de acesso', e);
  }
}

module.exports = {
  checkedAuthCode
}