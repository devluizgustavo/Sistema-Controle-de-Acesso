const { FindOne, Update } = require('../util/dbRepository');
const Validator = require('validator');
const { removeMask, captalizeText } = require('../util/treatData.js')
const GetDateNow = require('../util/getDateNow.js');

let sql = null;

class GetDataModel {
  constructor(id) {
    this.id = id;
    this.errors = [];
    this.record = null;
  }

  async initData() {
    await this.validate();
    this.record = this.registerExists();
    // this.checkedCamps();
  }

  async validate() {
    try {
      if (!this.id) this.errors.push('ID não enviado');
      if (!await this.registerExists()) this.errors.push('Registro Não Encontrado');
    } catch (e) {
      console.error('Erro ao tentar fazer a validação:', e);
    }
  }

  async registerExists() {
    try {
      sql = 'SELECT cad_id, cad_name, cad_lastname, cad_dt_nasc, cad_rg, cad_cpf, cad_tel, cad_email FROM Cadastro WHERE cad_id = (?)';
      const row = await FindOne(sql, [this.id]);
      return row;
    } catch (e) {
      console.error('Erro ao tentar verificar a existência do registro:', e);
    }
  }

  // checkedCamps() {
  //   for (let i in this.data) {
  //     if (this.record[i] === null) {
  //       this.record[i] = 'Não Cadastrado';
  //     }
  //   }
  // }
}

class UpdateDataModel {
  constructor(newData) {
    this.id = newData.id;
    this.objData = {
      name: captalizeText(newData.name),
      lastname: captalizeText(newData.lastname),
      dtnasc: newData.dtnasc,
      cpf: removeMask(newData.cpf, 'cpf'),
      rg: removeMask(newData.rg, 'rg'),
      tel: removeMask(newData.tel, 'tel'),
      email: newData.email
    }
    this.errors = [];
  }

  async initUpdated() {
    this.cleanUp();
    await this.validate();

    if (this.errors.length > 0) return;
    await this.updatedRegister();
  }

  async validate() {
    try {
      const date = new Date();
      const dtNascNumber = Number(this.objData.dtnasc.slice(0, -6))
      const minYear = date.getFullYear() - 13;
      const maxYear = date.getFullYear() - 150;

      if (!await this.registerExists()) this.errors.push('O Registro não foi encontrado');
      if (!Validator.isAlpha(this.objData.name.replace(/\s+/g, '')) || !Validator.isAlpha(this.objData.lastname.replace(/\s+/g, '')))
        this.errors.push('Nome ou Sobrenome não deve conter números ou caracteres especiais');
      if (dtNascNumber > minYear || dtNascNumber < maxYear) this.errors.push('Data de nascimento inválida');
      if (!this.objData.rg && !this.objData.cpf) this.errors.push('É necessário que ao menos um dos campos sejam preenchidos: CPF ou RG');

      if (this.objData.tel !== null && this.objData.tel.length !== 11) this.errors.push('Numero de telefone inválido');
      if (this.objData.email !== null && !Validator.isEmail(this.objData.email)) this.errors.push('E-mail Inválido');
    } catch (e) {
      console.error('Erro ao tentar efetuar a validação:', e);
    }
  }

  async updatedRegister() {
    try {
      const dateNow = GetDateNow();
      sql = `UPDATE Cadastro SET cad_name = ?, cad_lastname = ?, cad_rg = ?, cad_cpf = ?, cad_dt_nasc = ?, cad_email = ?,
             cad_tel = ?, cad_dt_att = ?
             WHERE cad_id = ?`
      const row = await Update(sql, [this.objData.name, this.objData.lastname, this.objData.rg, this.objData.cpf, this.objData.dtnasc, this.objData.email, this.objData.tel, dateNow, this.id]);
      return (`Os dados foram atualizados:`, row);
    } catch (e) {
      console.error('Erro na tentativa de atualizar os dados do registro: ', e);
    }
  }

  async registerExists() {
    try {
      sql = 'SELECT cad_id FROM Cadastro WHERE cad_id = (?)';
      const row = await FindOne(sql, [this.id]);
      return row;
    } catch (e) {
      console.error('Erro na tentativa de fazer a verificação')
    }
  }

  cleanUp() {
    for (let i in this.objData) {
      if (this.objData[i] === 'NãoCadastrado' || this.objData[i] === 'Não Cadastrado') {
        this.objData[i] = null;
      }
    }
  }
}

module.exports = { GetDataModel, UpdateDataModel };