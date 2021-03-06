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
  getLaporanAnalisis: (bidang) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT *
                   FROM hasil
                   where cluster = ?`;
      db.query(sql, bidang, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      })
    });
  },
  getTrenBidangSkripsi: () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT *
                   FROM hasil`;
      db.query(sql, (err, result) => {
        if (!err) {
          const cluster1 = result?.filter(item => item.cluster === 'C1')?.length ?? 0;
          const cluster2 = result?.filter(item => item.cluster === 'C2')?.length ?? 0;
          const cluster3 = result?.filter(item => item.cluster === 'C3')?.length ?? 0;
          resolve({
            cluster1: cluster1,
            cluster2: cluster2,
            cluster3: cluster3
          });
        } else {
          reject(new Error(err));
        }
      })
    });
  },
};
