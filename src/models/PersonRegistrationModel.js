const { Create, FindOne } = require('../util/dbRepository.js');
const { captalizeText, removeMask } = require('../util/treatData.js');
const validator = require('validator');

class RegisterPeopleModel {
  constructor(args, ctr_id) {
    this.name = captalizeText(args.name);
    this.lastname = captalizeText(args.lastname);
    this.rg = removeMask(args.rg, 'rg');
    this.org = args.org.toUpperCase();
    this.cpf = removeMask(args.cpf, 'cpf');
    this.dtnasc = args.dtnasc;
    this.sexo = args.sexo;
    this.tel = removeMask(args.tel, 'tel');
    this.ctr_id = ctr_id;
    this.email = args.email;
    this.errors = [];
    this.cadastro = null;
  }

  async initCadastro() { // Inicializa o cadastro
    try {
      await this.validation();
      if (this.errors.length > 0) return;
      await this.createCadastro();
    } catch (e) {
      console.error('Erro ao criar cadastro:', e);
    }
  }

  async validation() { // Executa métodos de validação
    this.cleanUp();
    this.validateName();
    await this.validateIdentification();
    this.validateDateOfBirth()
    this.validateEmailAndTel();
  }

  async validateIdentification() { // Faz a verificação das identificações
    try {
      if (!this.cpf && !this.rg) this.errors.push('É necessário que ao menos RG ou CPF seja cadastrado\n');
      if (this.rg && (this.rg.length < 7 || this.rg.length > 13)) this.errors.push('RG Inválido\n');
      if (this.rg && await this.rgExists()) this.errors.push('O RG digitado já existe no sistema\n');
      if (this.cpf && (this.cpf.length < 11)) this.errors.push('CPF inválido\n');
      if (this.cpf && await this.cpfExists()) this.errors.push('O CPF digitado já existe no sistema\n');
    } catch (e) {
      console.error('Erro ao efetuar as verificações de identidade', e);
    }
  }


  async rgExists() { // Verifica se o RG digitado já existe
    try {
      const sql = `SELECT cad_id FROM Cadastro WHERE cad_rg = ?`;
      const row = await FindOne(sql, this.rg);
      return typeof row === 'undefined' ? false : true;
    } catch (e) {
      console.error('Erro ao verificar o RG:', e);
    }
  }

  async cpfExists() { // Verifica se o CPF digitado já existe
    try {
      const sql = `SELECT cad_id FROM Cadastro WHERE cad_cpf = ?`;
      const row = await FindOne(sql, this.cpf);
      return typeof row === 'undefined' ? false : true;
    } catch (e) {
      console.error('Erro ao verificar o CPF', e);
    }
  }

  async createCadastro() { // Inserir os dados do cadastro
    try {
      const sql = `INSERT INTO Cadastro (ctr_id, cad_name, cad_lastname, cad_rg, cad_org_exp, cad_cpf, cad_dt_nasc, cad_sexo, cad_tel, cad_email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      this.cadastro = await Create(sql, [this.ctr_id, this.name, this.lastname, this.rg, this.org, this.cpf,
      this.dtnasc, this.sexo, this.tel, this.email]);
    } catch (e) {
      console.error('Erro ao inserir os dados do cadastro:', e);
    }
  }

  validateName() { // Validar o nome completo
    const regex = /^[A-Za-z\s]+$/;
    if (this.name == '' || this.lastname == '') return this.errors.push('Nome/Sobrenome é Obrigatório\n');
    if (!regex.test(this.name) || !regex.test(this.lastname))
      this.errors.push('Nome/Sobrenome não deve conter numeros ou caracteres especiais\n');
  }

  validateDateOfBirth() { // Validar a data de nascimento
    if (!this.dtnasc) return this.errors.push('É necessário que data de nascimento seja preenchida\n');

    const date = new Date();
    const minYear = date.getFullYear() - 13;
    const maxYear = date.getFullYear() - 150;
    const dtNascNumber = Number(this.dtnasc.slice(0, 4))
    if (dtNascNumber > minYear || dtNascNumber < maxYear) this.errors.push('Data de nascimento inválida\n');
  }

  validateEmailAndTel() { //Validar o email e o telefone
    if (this.email && !validator.isEmail(this.email)) this.errors.push('Email inválido\n');
    if (this.tel && (this.tel.length < 10 || this.tel.length > 11)) this.errors.push('Telefone inválido\n');
  }

  cleanUp() { // Campos que não forem enviados, serão titulados como null
    for (const key in this) {
      if (this[key] === '') {
        this[key] = null;
      }
    }
  }
}

module.exports = RegisterPeopleModel;
