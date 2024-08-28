const UserRegisterModel = require('../models/UserRegisterModel');
const { dialog } = require('electron');

async function UserRegisterController(args, adm_id) {
  try {
    const register = new UserRegisterModel(args, adm_id);

    await register.initRegister();

    let string = `Confira os campos abaixo\n`;
    register.errors.forEach(val => string += val);

    if (register.errors.length > 0) {
      return dialog.showErrorBox('Cadastro não efetuado', `\n${string}`);
    }
    
    return register.register;
  } catch (e) {
    console.error('Erro ao tentar fazer o Cadastro :', e);
  }
}
module.exports = UserRegisterController;