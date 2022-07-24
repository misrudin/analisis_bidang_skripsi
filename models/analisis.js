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
      const sql = `INSERT INTO hasil (hasil.nim, hasil.nama, hasil.cluster)
                   values ? ON DUPLICATE KEY
                   UPDATE
                       nim =
                   VALUES (hasil.nim),
                       nama =
                   VALUES (hasil.nama),
                       cluster =
                   VALUES (hasil.cluster)`;
      const sqlDeleteMahasiswa = `TRUNCATE TABLE mahasiswa`;
      const sqlDeleteNilai = `TRUNCATE TABLE nilai_mhs`;

      db.query(sql, [valuesInsert],
        (err, _) => {
          if (!err) {
            db.query(sqlDeleteMahasiswa, (errDeleteMhs, _) => {
              if (!errDeleteMhs) {
                db.query(sqlDeleteNilai, (errDeleteNilai, _) => {
                  if (!errDeleteNilai) {
                    resolve(data)
                  } else {
                    reject(new Error(errDeleteNilai));
                  }
                })
              } else {
                reject(new Error(errDeleteMhs))
              }
            })
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  saveResultNoDelete: (data) => {
    return new Promise((resolve, reject) => {
      const valuesInsert = data.map((item) => [item.nim, item.nama, item.cluster])
      const sql = `INSERT INTO hasil (hasil.nim, hasil.nama, hasil.cluster)
                   values ? ON DUPLICATE KEY
                   UPDATE
                       nim =
                   VALUES (hasil.nim),
                       nama =
                   VALUES (hasil.nama),
                       cluster =
                   VALUES (hasil.cluster)`;
      db.query(sql, [valuesInsert],
        (err, _) => {
          if (!err) {
            resolve(data)
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  getLaporanAnalisis: (bidang, angkatan) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT nim, nama, cluster, angkatan
                   FROM hasil
                   where cluster like '%'${bidang}'%' and angkatan like '%'${angkatan}'%'`;
      db.query(sql, [bidang, angkatan], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          console.log(err)
          reject(new Error(err));
        }
      })
    });
  },
  getTrenBidangSkripsi: () => {
    return new Promise((resolve, reject) => {
      const sqlCluster1 = `SELECT (SELECT count(*)
                                   FROM hasil where cluster = 'C1') AS cluster1,
                                  (SELECT count(*)
                                   FROM hasil where cluster = 'C2') AS cluster2,
                                  (SELECT count(*)
                                   FROM hasil where cluster = 'C3') AS cluster3;`
      db.query(sqlCluster1, (err, result) => {
        if (!err) {
          resolve({
            cluster1: result[0].cluster1,
            cluster2: result[0].cluster2,
            cluster3: result[0].cluster3
          });
        } else {
          reject(new Error(err));
        }
      })
    });
  },
};
