const { FindOne, Create } = require('../util/dbRepository.js')
const { removeMask } = require('../util/treatData');

class AccessModel {
  constructor(deptoAndAssunto, lastCadastro) {
    this.cpf = removeMask(lastCadastro.cpf, 'cpf');
    this.rg = removeMask(lastCadastro.rg, 'rg');
    this.assunto = deptoAndAssunto.assunto;
    this.idDepto = Number(deptoAndAssunto.departamento);
    this.idCadAndCtr = null;
    this.idAssunto = null;
    this.errors = [];
    this.accessIsTrue = null;
  }

  async initAccess() {
    try {
      this.validation();
      await this.getIDCadAndCtr();
      await this.getIDAssunto();

      if (this.errors.length > 0) return;

      await this.createAccess();
    } catch (e) {
      console.error('Erro ao iniciar a liberação do acesso', e);
    }
  }

  validation() {
    if (this.assunto == '' || this.idDepto == '') this.errors.push('Campos: Departamento e Assunto devem ser preenchidos');
    if (!this.cpf && !this.rg) this.errors.push('Dados não foram encontrados ou não existem');
  }

  async getIDCadAndCtr() {
    try {
      const sql = 'SELECT cad_id, ctr_id FROM Cadastro WHERE cad_cpf = ? OR cad_rg = ?';
      const row = await FindOne(sql, [this.cpf, this.rg]);
      this.idCadAndCtr = row;
    } catch (e) {
      console.error('Erro ao verificar o CPF/RG', e);
    }
  }

  async getIDAssunto() {
    try {
      const sql = 'SELECT ass_id FROM Assuntos WHERE dep_id = ? AND ass_desc = ?';
      const row = await FindOne(sql, [this.idDepto, this.assunto]);
      this.idAssunto = row;
    } catch(e) {
      console.error('Erro ao encontrar o ID do Assunto', e);
    }
  }

  async createAccess() {
    try {
      const sql = `INSERT INTO Acesso_Historico (cad_id, dep_id, ctr_id, ass_id)
                   VALUES(?, ?, ?, ?)`;
      const row = await Create(sql, [this.idCadAndCtr.cad_id, this.idDepto, this.idCadAndCtr.ctr_id, this.idAssunto.ass_id]);
      this.accessIsTrue = row;
    } catch(e) {
      console.error('Erro ao inserir os dados de acesso', e);
    }
  }
}

module.exports = AccessModel;