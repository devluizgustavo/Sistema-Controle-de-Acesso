const LoginModel = require('../models/LoginModel.js');
const { dialog } = require('electron');

async function loginController(args) {
  try {
    const login = new LoginModel(args);
    await login.initLogin();

    let string = 'Confira os campos abaixo:\n';
    login.errors.forEach(val => string += val);

    if (login.errors.length > 0) {
      return dialog.showErrorBox('Login não efetuado', `\n${string}`);
    }
    
    return login.login;
  } catch (e) {
    console.error('Erro ao tentar fazer o login:', e);
  }
}

module.exports = loginController;