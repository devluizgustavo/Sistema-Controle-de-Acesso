const sqlite3 = require('sqlite3');
const path = require('path');


function db_connection() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, 'database.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, sqlite3.OPEN_CREATE, (err) => {
      if (err) return reject('Erro ao tentar a conexão com o banco de dados', err);
      console.log('Conexão bem-sucedida com o SQlite');
    })

    resolve(db);
  })
}

module.exports = db_connection;