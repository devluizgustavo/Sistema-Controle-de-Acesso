const { FindOne } = require('../util/dbRepository.js');
const getLogAccessByID = require('../util/getLogAccessByID.js');

let sql = null;

class LogHistoryModel {
  constructor(id) {
    this.id = id;
    this.logUser = null;
    this.errors = [];
  }

  async initLog() {
    await this.validate();
  
    this.logUser = await getLogAccessByID(this.id);
  }

  async validate() {
    if (!await this.idExists()) this.errors.push('Registro não localizado\n');
    if (!await this.userExistsLogHistory()) 
    this.errors.push('A pessoa selecionada não possui registros de acesso ao prédio\n');
  }

  async idExists() {
    try {
      sql = 'SELECT cad_id FROM Cadastro WHERE cad_id = (?)';
      const row = await FindOne(sql, [this.id]);
      return row;
    } catch (e) {
      console.error('Erro ao tentar localizar o registro:', e);
    }
  }

  async userExistsLogHistory() {
    try {
      sql = 'SELECT cad_id FROM Acesso_Historico WHERE cad_id = (?)';
      const row = await FindOne(sql, [this.id]);
      return row;
    } catch (e) {
      console.error('Erro ao tentar verificar a existência de acesso ao prédio: ', e);
    }
  }

}

module.exports = LogHistoryModel;

