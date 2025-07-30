const { FindAll } = require('./dbRepository');

async function getRecordsNotInBuildingAccess() {
  try {
    const sql = `SELECT cad_id as id, cad_name || ' ' || cad_lastname as 'fullname', cad_rg as 'rg', cad_cpf as 'cpf'
    	           FROM Cadastro
                 WHERE cad_id NOT IN (SELECT cad_id
                                      FROM Acesso_Historico)
                                      ORDER BY cad_id DESC;`
                                      
    const rows = await FindAll(sql);
    return rows;
  } catch (e) {
    console.error('Erro ao tentar encontrar os acessos', e);
  }
}

module.exports = getRecordsNotInBuildingAccess;