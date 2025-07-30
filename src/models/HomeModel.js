const validator = require('validator');
const { FindAll } = require('../util/dbRepository');

class HomeModel {
  constructor(args) {
    this.fullNames = null;
    this.valueInput = args.replace(/\s+/g, '');
    this.recordsIDFound = null;
    this.recordsFoundByID = null;
    this.fullAccessAndRecordsInSystem = global.allAccessInSystem;
  }

  async initSearch() {
    await this.validate();        
    this.recordsFoundByID = this.fullAccessAndRecordsInSystem.filter(record => this.recordsIDFound.includes(record.id));
    return true;
  }

  async validate() {
    //Se retornar true, é porque contém numeros no input
    if (!validator.isAlpha(this.valueInput)) {
      await this.findByRgOrCPF();
    } else {
      await this.getFullNames();
      this.filterByFullName();
    }
  }

  filterByFullName() {
    const valueInpLower = this.valueInput.toLowerCase();
    const namesFilter = this.fullNames.filter(name => {
      const normalizedName = name.toLowerCase().trim().replace(/\s+/g, '');
      return normalizedName.includes(valueInpLower)
    });

    const recordAll = this.fullAccessAndRecordsInSystem.filter(record => namesFilter.includes(record.fullname));
    this.recordsIDFound = recordAll.map(record => record.id);
  }

  async findByRgOrCPF() {
    try {
      const valueLike = `${this.valueInput}%`;
      const sql = `SELECT cad_id FROM Cadastro WHERE cad_cpf LIKE ? OR cad_rg LIKE ?`;
      const row = await FindAll(sql, [valueLike, valueLike]);
      this.recordsIDFound = row.map(record => record.cad_id);
    } catch (e) {
      console.error('Erro ao tentar realizar a consulta pelo CPF/RG:', e);
    }
  }

  async getFullNames() {
    try {
      const fullnames = this.fullAccessAndRecordsInSystem.map(record => record.fullname);
      this.fullNames = fullnames;
    } catch (e) {
      console.error('Erro ao tentar realizar a consulta pelo nome:', e);
    }
  }
}

module.exports = HomeModel;