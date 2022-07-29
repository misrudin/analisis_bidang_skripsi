const db = require("../configs/db");
const helpers = require("../helpers");

module.exports = {
  getDataNilaiMahasiswa: (angkatan) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM view_data_nilai where angkatan = ?", angkatan, (err, result) => {
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
      const valuesInsert = data.map((item) => [item.nim, item.nama, item.cluster, item.angkatan])
      const valueUpdate = data.map((item) => {
        return `WHEN '${item.nim}' THEN 1`
      }).join(" ");
      const valueUpdateId = data.map((item) => item.nim).join(", ")

      const sql = `INSERT INTO hasil (hasil.nim, hasil.nama, hasil.cluster, hasil.angkatan)
                   values ? ON DUPLICATE KEY
      UPDATE
          nim =
      VALUES (hasil.nim),
          nama =
      VALUES (hasil.nama),
          cluster =
      VALUES (hasil.cluster),
          angkatan =
      VALUES (hasil.angkatan)`;
      const sqlUpdateMhs = `UPDATE mahasiswa
                            SET isAnalyze = CASE nim
                                                ${valueUpdate}
                                            END
                            WHERE nim IN (${valueUpdateId})`;
      console.log(sqlUpdateMhs);
      db.query(sql, [valuesInsert],
        (err, _) => {
          if (!err) {
            db.query(sqlUpdateMhs, (errUpdateMhs, _) => {
              if (!errUpdateMhs) {
                resolve(data)
              } else {
                reject(new Error(errUpdateMhs));
              }
            })
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  getLaporanAnalisis: ({bidang, angkatan}) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT nim, nama, cluster, angkatan FROM hasil where cluster like ? and angkatan like ?";
      db.query(sql, ['%' + bidang + '%', '%' + angkatan + '%'], (err, result) => {
        console.log(sql);
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
      const sqlCluster1 = `select angkatan, cluster, count(*) as total_angkatan from hasil group by angkatan, cluster;`
      db.query(sqlCluster1, (err, result) => {
        if (!err) {
          const allLabels = result.map(item => item.angkatan)
          const labels = allLabels.filter((item, index) => allLabels.indexOf(item) === index)
          const data = helpers.groupByKey(result, 'angkatan')

          const cluster1 = []
          const cluster2 = []
          const cluster3 = []
          Object.keys(data).forEach(key => {
            const c1 = data[key].find(item => item.cluster === 'C1')?.total_angkatan
            cluster1.push(c1 ?? 0)
            const c2 = data[key].find(item => item.cluster === 'C2')?.total_angkatan
            cluster2.push(c2 ?? 0)
            const c3 = data[key].find(item => item.cluster === 'C3')?.total_angkatan
            cluster3.push(c3 ?? 0)
          })

          resolve({
            labels: labels,
            dataset_1: cluster1,
            dataset_2: cluster2,
            dataset_3: cluster3,
          })
        } else {
          reject(new Error(err));
        }
      })
    });
  },
  getBidangSkripsi: (mahasiswa) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT nim, nama, cluster, angkatan
                   FROM hasil
                   where nim = ?`;
      db.query(sql, mahasiswa, (err, result) => {
        if (!err) {
          if (result.length === 0) {
            reject(new Error("Data tidak ditemukan"));
          } else {
            const dataResult = result.map((item) => {
              return {
                ...item,
                bidang_skripsi: helpers.kelompokSkripsi(item.cluster)
              }
            })
            resolve(dataResult[0]);
          }
        } else {
          reject(new Error(err));
        }
      })
    });
  },
};
