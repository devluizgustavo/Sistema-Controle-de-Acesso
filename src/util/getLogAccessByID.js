const { FindAll } = require('./dbRepository');

async function getLogAccessByID(id) {
  try {
    const sql = `
    SELECT cad.cad_id as 'id', cad.cad_name || ' ' || cad.cad_lastname AS 'fullname', cad.cad_rg AS 'rg', cad.cad_cpf AS 'cpf',
    substr(acc_data, 9, 2) || '/' || substr(acc_data, 6, 2) || '/' || substr(acc_data, 1, 4) AS date, substr(acc_hr_ent, 1, 2) || 'h' || substr(acc_hr_ent, 4, 2) AS 'datetime', dep_nome AS "name_depto", ass_desc AS "desc_assunto", ctr.ctr_nome AS 'nm_controlador'
    FROM Acesso_Historico ach
    JOIN Cadastro cad 
    ON cad.cad_id = ach.cad_id
    JOIN Departamento dep
    ON ach.dep_id = dep.dep_id
    JOIN Assuntos ass
    ON ach.ass_id = ass.ass_id
    JOIN Controlador ctr
    ON ach.ctr_id = ctr.ctr_id
    INNER JOIN (
                SELECT cad_id, MAX(acc_data || acc_hr_ent) AS max_timestamp
                FROM Acesso_Historico
               ) WHERE cad.cad_id = (?)
                 ORDER BY ach.acc_data DESC, 
                          ach.acc_hr_ent DESC;`;
    const rows = await FindAll(sql, [id]);
    return rows;
  } catch (e) {
    console.error('Erro ao tentar encontrar os acessos', e);
  }
}

module.exports = getLogAccessByID;