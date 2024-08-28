const { FindOne } = require('../util/dbRepository.js');
const { hashCompare } = require('../util/bcryptFunc.js');

class UserLoginModel {
  constructor(args) {
    this.user = args.user;
    this.password = args.password;
    this.errors = [];
    this.login = null;
  }

  async initLogin() {
    try {
      await this.validation();
      if (this.errors.length > 0) return;
    } catch (e) {
      console.error('Erro ao iniciar a validação do usuario:', e);
    }
  }

  async validation() {
    try {
      this.cleanUp();
      this.validateUserAndPassword();
      await this.userExists();
      await this.passwordCompare();
      this.userInative();
    } catch (e) {
      console.error('Erro ao tentar validar o login:', e);
    }
  }

  async userExists() {
    try {
      const sql = 'SELECT * FROM Controlador WHERE ctr_usu = (?)'
      const row = await FindOne(sql, this.user);
      if (!row) return this.errors.push('Usuário não existe');
      this.login = row;
    } catch (e) {
      console.error('Erro ao verificar a existência do usuario:', e);
    }
  }

  async passwordCompare() {
    try {
      if (!await hashCompare(this.password, this.login.ctr_senha)) this.errors.push('Senha incorreta\n');
    } catch (e) {
      console.error('Erro ao fazer a comparação da senha:', e);
    }
  }

  userInative() {
    if (this.login.ctr_ativo !== 1) this.errors.push('Seu usuário está inativo\n');
  }

  validateUserAndPassword() {
    const userRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).$/;
    if (!userRegex.test(this.user) || !passwordRegex.test(this.password))
      if (this.user.length < 8) this.errors.push('Campo usuário precisa ter no mínimo 8 caracteres\n');
    if (this.password.length > 15) this.errors.push('Campo senha precisa ter no máximo 15 caracteres\n');
  }

  cleanUp() {
    const fields = ['user', 'password'];
    for (const field of fields) {
      if (typeof this[field] !== 'string') {
        this[field] = '';
      }
    }
  }
}

module.exports = UserLoginModel;
