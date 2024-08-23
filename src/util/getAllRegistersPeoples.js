const { FindAll } = require('./dbRepository');

async function getFullRegisters() {
  try {
    const sql = 'SELECT * FROM Cadastro';
    const fullRegisters = await fi
  } catch(e) {
    console.error('Erro ao tentar acessar a base de dados', e);
  }
}

module.exports = getFullRegisters;