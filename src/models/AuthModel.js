const Validator = require('validator');
const { hashCompare } = require('../util/bcryptFunc');
const { FindAll } = require('../util/dbRepository.js');

class AuthModel {
  constructor(args) {
    this.code = args;
    this.errors = [];
    this.admin = null;
  }

  async initAuth() {
    try {
      await this.validation();
      if (this.errors.length > 0) return;
    } catch (e) {
      console.error('Erro ao iniciar a autenticação da chave', e);
    }
  }

  async validation() {
    try {
      if (this.code.length !== 10) this.errors.push('Chave de acesso inválida');
      if (Validator.isAlpha(this.code)) this.errors.push('Chave de acesso inválida');
      if (!await this.codeExists()) this.errors.push('Chave de acesso inválida');
    } catch (e) {
      console.error('Erro ao validar a chave de acesso', e);
    }
  }

  async codeExists() {
    try {
      const sql = `SELECT * FROM Admin`;
      const allHashsInDB = await FindAll(sql);
      for (let row of allHashsInDB) {
        let hash = row.adm_code;
        if (await hashCompare(this.code, hash)) {
          this.admin = row;
          return true;
        }
      }
    } catch (e) {
      console.error('Erro ao verificar a existência da chave', e);
    }
  }
}

module.exports = AuthModel