const { FindAll } = require('./dbRepository');

async function getRecordsDescendingOrder(allData) {
    try {
      const sql = `
      SELECT cad.cad_id as 'id', cad.cad_name || ' ' || cad.cad_lastname AS 'fullname', cad.cad_rg AS 'rg', cad.cad_cpf AS 'cpf',
      substr(acc_data, 9, 2) || '/' || substr(acc_data, 6, 2) || '/' || substr(acc_data, 1, 4) || ' ' ||  
      substr(acc_hr_ent, 1, 2) || 'h' || substr(acc_hr_ent, 4, 2) AS 'last_access', dep_nome AS "name_depto", ass_desc AS "desc_assunto"
      FROM Acesso_Historico ach
      JOIN Cadastro cad 
      ON cad.cad_id = ach.cad_id
      JOIN Departamento dep
      ON ach.dep_id = dep.dep_id
      JOIN Assuntos ass
      ON ach.ass_id = ass.ass_id
      INNER JOIN (
                  SELECT cad_id, MAX(acc_data || acc_hr_ent) AS max_timestamp
                  FROM Acesso_Historico
                  GROUP BY cad_id
                 ) AS latest ON ach.cad_id = latest.cad_id AND (ach.acc_data || ach.acc_hr_ent) = latest.max_timestamp
                   ORDER BY cad.cad_name DESC;`;
      const rows = await FindAll(sql);
      return rows;
    } catch (e) {
      console.error('Erro ao tentar encontrar os acessos', e);
    }
  }

module.exports = getRecordsDescendingOrder;
  