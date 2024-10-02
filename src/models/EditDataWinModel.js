const { FindOne } = require('../util/dbRepository');

let sql = null;

class EditDataWinModel {
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
      sql = 'SELECT cad_name, cad_lastname, cad_dt_nasc, cad_rg, cad_cpf, cad_tel, cad_email FROM Cadastro WHERE cad_id = (?)';
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

module.exports = EditDataWinModel;