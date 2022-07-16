const db = require('../configs/db');

module.exports = {
  getDataNilaiMahasiswa: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM view_data_nilai", (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  getDataCluster: (nim) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT *
                FROM view_data_nilai
                where nim = ${nim}`, (err, result) => {
        if (!err) {
          if (result.length !== 0) {
            const dataResult = result[0];
            dataResult.data_nilai = JSON.parse(dataResult.data_nilai)
            resolve(dataResult);
          } else {
            reject(new Error(`Data cluster ${nim} tidak ditemukan`));
          }
        } else {
          reject(new Error(err));
        }
      });
    });
  }
}