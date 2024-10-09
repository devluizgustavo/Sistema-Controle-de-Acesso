const { FindOne, Create } = require('../util/dbRepository.js')

class RealeaseAccessModel {
  constructor(deptoAndAssunto, idRecord) {
    this.idRecord = idRecord
    this.assunto = deptoAndAssunto.assunto;
    this.idDepto = Number(deptoAndAssunto.departamento);
    this.idAssunto = null;
    this.idCtr = global.user.ctr_id;
    this.errors = [];
    this.accessIsTrue = null;
  }

  async initAccess() {
    try {
      this.validation();
      console.log(this.assunto);
      await this.getAssID();

      if (this.errors.length > 0) return;

      await this.createAccess();
    } catch (e) {
      console.error('Erro ao iniciar a liberação do acesso', e);
    }
  }

  validation() {
    if (this.assunto == '' || this.idDepto == '') this.errors.push('Campos: Departamento e Assunto devem ser preenchidos');
    if (!this.idRecord) this.errors.push('Registro não encontrado/ou não existe');
  }

  async getAssID() {
    try {
      const sql = `SELECT ass_id FROM Assuntos WHERE ass_desc = ? AND dep_id = ?`;
      const row = await FindOne(sql, [this.assunto, this.idDepto]);
      this.idAssunto = row.ass_id;
    } catch (e) {
      console.error('Erro ao tentar encontrar o ID do Assunto');
    }
  }

  async createAccess() {
    try {
      const sql = `INSERT INTO Acesso_Historico (cad_id, dep_id, ctr_id, ass_id)
                   VALUES(?, ?, ?, ?)`;
      const row = await Create(sql, [this.idRecord, this.idDepto, this.idCtr, this.idAssunto]);
      this.accessIsTrue = row;
    } catch (e) {
      console.error('Erro ao inserir os dados de acesso', e);
    }
  }
}

module.exports = RealeaseAccessModel;