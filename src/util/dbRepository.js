const db_connection = require('../database/connection.js');

async function FindAll(sql, params = []) {
  try {
    const db = await db_connection().then((res) => res);
    const rows = await new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      })
    })

    db.close();
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

    db.close();
    return row;
  } catch (e) {
    console.log(e);
  }
}

async function Create(sql, params = []) {
  try {
    const db = await db_connection().then((res) => res);
    const row = await new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err);
        return resolve(true);
      });
    })

    db.close();
    return row;
  } catch (e) {
    console.log(e);
  }
}

async function Update(sql, params = []) {
  try {
    const db = await db_connection().then((res) => res);
    const row = await new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err);
        return resolve(true);
      })
    })
  } catch (e) {
    console.log(e);
  }
}

/**
 * 
 * @param {*} nameTable Nome da Tabela que deseja Excluir o Dado
 * @param {*} Condition Condição da Query
 * @param {*} id ID do cadastro
 */
async function DeleteByID(nameTable, Condition, id = []) {
  try {
    let sql = `DELETE FROM ${nameTable} WHERE ${Condition} = ?`
    const db = await db_connection().then((res) => res);
    const row = await new Promise((resolve, reject) => {
      db.run(sql, [id], (err) => {
        if (err) reject(err);
        return resolve(true);
      })
    })
    return row;
  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  FindAll,
  Create,
  FindOne,
  Update,
  DeleteByID,
}