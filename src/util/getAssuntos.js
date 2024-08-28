const { FindAll } = require('./dbRepository.js')

async function getAssunto(args) {
  try {
    if (typeof args !== 'number') return;

    const sql = 'SELECT ass_desc FROM Assuntos WHERE dep_id = ?';
    const assuntos = await FindAll(sql, args);

    const descAssuntos = assuntos.map((val) => val.ass_desc);

    return descAssuntos;
  } catch (e) {
    console.error('Erro ao tentar encontrar o Assunto:', e);
  }
}

module.exports = getAssunto