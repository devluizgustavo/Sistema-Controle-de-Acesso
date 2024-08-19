const RegisterModel = require('../models/RegisterModel.js');
const { dialog } = require('electron');

async function registerController(args, adm_id) {
  try {
    const register = new RegisterModel(args, adm_id);

    await register.initRegister();

    let string = `Confira os campos abaixo\n`;
    register.errors.forEach(val => string += val);

    if (register.errors.length > 0) {
      return dialog.showErrorBox('Login não efetuado', `\n${string}`);
    }
    
    return register.register;
  } catch (e) {
    console.error('Erro ao tentar fazer o login:', e);
  }
}
module.exports = registerController;