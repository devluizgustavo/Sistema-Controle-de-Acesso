const { FindOne, Create } = require('../util/dbRepository.js');
const { hashCompare, createdHash } = require('../util/bcryptFunc.js');
const { captalizeText } = require('../util/treatData.js');
const Validator = require('validator');

class RegisterModel {
  constructor(args, adm_id) {
    this.user = args.user;
    this.name = captalizeText(args.name);
    this.lastname = captalizeText(args.lastname);
    this.password = args.password;
    this.sexo = args.sexo;
    this.admId = adm_id;
    this.errors = [];
    this.register = null;
    this.passwordHash = null;
  }

  async initRegister() {
    try {
      await this.validation();
      if (this.errors.length > 0) return;

      await this.createdUser();
    } catch (e) {
      console.error('Erro ao iniciar a validacao do cadastro:', e);
    }
  }

  async validation() {
    try {
      this.cleanUp();
      this.validateName();
      this.validateUserAndPassword();
      await this.userExists();
      await this.createdPasswordHash();
    } catch (e) {
      console.error('Erro ao tentar validar o cadastro:', e);
    }
  }

  async createdUser() {
    try {
      const sql = `INSERT INTO Controlador (ctr_usu, ctr_nome, ctr_sbnome, ctr_senha, ctr_created_by, ctr_sexo)
                   VALUES (?, ?, ?, ?, ?, ?)`;
      this.register = await Create(sql, [this.user, this.name, this.lastname, this.passwordHash, this.admId, this.sexo]);
    } catch (e) {
      console.error('Erro ao criar o novo usuário', e);
    }
  }

  async createdPasswordHash() {
    try {
      this.passwordHash = await createdHash(this.password, 10);
    } catch (e) {
      console.error('Erro ao criar o hash da senha:', e);
    }
  }

  async userExists() {
    try {
      const sql = 'SELECT ctr_id FROM Controlador WHERE ctr_usu = ?';
      const row = await FindOne(sql, this.user);
      if (row) this.errors.push('Usuário já existe');
    } catch (e) {
      console.error('Erro ao verificar a existencia do usuario', e);
    }
  }

  validateUserAndPassword() {
    if (Validator.isAlpha(this.user) || Validator.isAlpha(this.password)) this.errors.push('Campo Senha/Usuário precisa conter numeros e caracteres especiais');
    if (this.user.length < 5) this.errors.push('Usuário precisa ter no mínimo 5 caracteres');
    if (this.password.length < 7) this.errors.push('Senha precisa ter no mínimo 7 caracteres');
  }

  validateName() {
    if (this.name == '' || this.lastname == '') this.errors.push('Nome ou Sobrenome não podem ser nulos');
    if (Validator.isAlpha(this.name.replace(/\D+/g, '')) || Validator.isAlpha(this.lastname.replace(/\D+/g, '')))
      this.errors.push('Nome ou Sobrenome deve conter somente letras');
  }

  cleanUp() {
    const fields = ['user', 'name', 'lastname', 'password', 'sexo'];
    for (const field of fields) {
      if (typeof this[field] !== 'string') {
        this[field] = '';
      }
    }
  }
}

module.exports = RegisterModel;

