const { dialog } = require('electron');
const db_connection = require('../database/connection.js');

async function FindAll(sql, params = []) {
  try {
    const db = await db_connection().then((res) => res);
    const rows = await new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      })
    })

    return rows;
  } catch (e) {
    console.log(e);
  }
}

async function FindOne(sql, params = []) {
  try {
    const db = await db_connection().then((res) => res);
    const row = await new Promise((resolve, reject) => {
      db.get(sql, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      })
    })

    return row;
  } catch (e) {
    console.log(e);
  }
}

async function Store(sql, params = []) {
  try {
    const db = await db_connection().then((res) => res);
    const row = await new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err);
        resolve('Dados inseridos com sucesso!');
      });
    })

    return row;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  FindAll,
  Store,
  FindOne,
}