const { FindOne, Create } = require('../util/dbRepository.js')
const { removeMask } = require('../util/treatData');

class RealeaseAccessModel {
  constructor(deptoAndAssunto, idRecord) {
    this.idRecord = idRecord
    this.assunto = deptoAndAssunto.assunto;
    this.idDepto = Number(deptoAndAssunto.departamento);
    this.idAssunto = null;
    this.idCtr = null;
    this.errors = [];
    this.accessIsTrue = null;
  }

  async initAccess() {
    try {
      this.validation();
      console.log(this.assunto);
      await this.getCtrID();
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

  async getCtrID() {
    try {
      const sql = `SELECT ctr_id FROM Cadastro WHERE cad_id = ?`;
      const row = await FindOne(sql, [this.idRecord]);
      this.idCtr = row.ctr_id;
    } catch(e) {
      console.error('Erro ao tentar encontrar o ID do Controlador');
    }
  }

  async getAssID() {
    try {
      const sql = `SELECT ass_id FROM Assuntos WHERE ass_desc = ? AND dep_id = ?`;
      const row = await FindOne(sql, [this.assunto, this.idDepto]);
      this.idAssunto = row.ass_id;
    } catch(e) {
      console.error('Erro ao tentar encontrar o ID do Assunto');
    }
  }


  async createAccess() {
    try {
      const sql = `INSERT INTO Acesso_Historico (cad_id, dep_id, ctr_id, ass_id)
                   VALUES(?, ?, ?, ?)`;
      const row = await Create(sql, [this.idRecord, this.idDepto, this.idCtr, this.idAssunto]);
      this.accessIsTrue = row;
    } catch(e) {
      console.error('Erro ao inserir os dados de acesso', e);
    }
  }
}

module.exports = RealeaseAccessModel;