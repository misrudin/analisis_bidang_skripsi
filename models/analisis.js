const db = require("../configs/db");

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
      db.query(
        `SELECT *
         FROM view_data_nilai
         where nim = ${nim}`,
        (err, result) => {
          if (!err) {
            if (result.length !== 0) {
              try {
                const dataResult = result[0];
                dataResult.data_nilai = JSON.parse(dataResult.data_nilai);
                resolve(dataResult);
              } catch (e) {
                reject(new Error(`Data cluster ${nim} tidak ditemukan`));
              }
            } else {
              reject(new Error(`Data cluster ${nim} tidak ditemukan`));
            }
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  saveResult: (data) => {
    return new Promise((resolve, reject) => {
      const valuesInsert = data.map((item) => [item.nim, item.nama, item.cluster])
      const sql = `INSERT INTO hasil (hasil.nim, hasil.nama, hasil.cluster) values ? ON DUPLICATE KEY UPDATE nim = VALUES(hasil.nim), nama = VALUES(hasil.nama), cluster = VALUES(hasil.cluster)`;
      db.query(sql, [valuesInsert],
        (err, result) => {
          if (!err) {
            resolve(data)
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  getLaporanAnalisis: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Suuccess");
      }, 5000);
    });
  },
  getTrenBidangSkripsi: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Suuccess");
      }, 5000);
    });
  },
};
