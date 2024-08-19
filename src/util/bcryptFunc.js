const bcrypt = require('bcryptjs');

function createdHash(code, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(code, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    })
  })
}

function hashCompare(userInputCode, DbHashCode) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(userInputCode, DbHashCode, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = { createdHash, hashCompare }