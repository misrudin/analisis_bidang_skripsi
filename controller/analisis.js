const helpers = require("../helpers");
const model = require("../models/analisis");

module.exports = {
  getAnalisis: async (req, res) => {
    try {
      const {nim_c1, nim_c2, nim_c3} = req.query;
      const resultMahasiswa = await model.getDataNilaiMahasiswa();
      const dataMahasiswa = resultMahasiswa.map(item => {
        return {
          ...item,
          data_nilai: JSON.parse(item.data_nilai)
        }
      })

      const dataCluster1 = await model.getDataCluster(nim_c1);
      const dataCluster2 = await model.getDataCluster(nim_c2);
      const dataCluster3 = await model.getDataCluster(nim_c3);

      let clusters = {
        cluster1: dataCluster1,
        cluster2: dataCluster2,
        cluster3: dataCluster3
      }

      let cluster_awal = {
        cluster1: {
          label: "C1",
          total: 0
        },
        cluster2: {
          label: "C2",
          total: 0
        },
        cluster3: {
          label: "C3",
          total: 0
        }
      }
      let cluster_akhir = null;
      let tempMhsWithCluster1, totalIterasi = 0;

      do {
        if (cluster_akhir) {
          cluster_awal = cluster_akhir;
        }
        totalIterasi++;
        console.log("Iterasi ke-" + totalIterasi);
        tempMhsWithCluster1 = dataMahasiswa.map(mhs => {
          const dataNilai1 = mhs.data_nilai.map((nilai, index) => {
            return helpers.pangkat(nilai.nilai - clusters.cluster1.data_nilai[index].nilai)
          }).reduce((a, b) => a + b, 0)

          const dataNilai2 = mhs.data_nilai.map((nilai, index) => {
            return helpers.pangkat(nilai.nilai - clusters.cluster2.data_nilai[index].nilai)
          }).reduce((a, b) => a + b, 0)

          const dataNilai3 = mhs.data_nilai.map((nilai, index) => {
            return helpers.pangkat(nilai.nilai - clusters.cluster3.data_nilai[index].nilai)
          }).reduce((a, b) => a + b, 0)

          const cluster1_value = Math.sqrt(dataNilai1)
          const cluster2_value = Math.sqrt(dataNilai2)
          const cluster3_value = Math.sqrt(dataNilai3)
          const min_value = helpers.getMin([cluster1_value, cluster2_value, cluster3_value])
          let cluster_value = 0
          if ((cluster1_value < cluster2_value) && (cluster1_value < cluster3_value)) {
            cluster_value = 1
          }
          if ((cluster2_value < cluster3_value) && (cluster2_value < cluster1_value)) {
            cluster_value = 2
          }
          if ((cluster3_value < cluster2_value) && (cluster3_value < cluster1_value)) {
            cluster_value = 3
          }

          return {
            ...mhs,
            data_nilai: mhs.data_nilai,
            cluster1: cluster1_value,
            cluster2: cluster2_value,
            cluster3: cluster3_value,
            min_value: min_value,
            cluster: cluster_value
          }
        })

        const cluster1_temp = tempMhsWithCluster1.filter(mhs => mhs.cluster === 1)
        const cluster2_temp = tempMhsWithCluster1.filter(mhs => mhs.cluster === 2)
        const cluster3_temp = tempMhsWithCluster1.filter(mhs => mhs.cluster === 3)

        const dataNilaiCluster1 = [];
        cluster1_temp.map(mhs => {
          mhs.data_nilai.map(e => {
            dataNilaiCluster1.push(e)
          })
        })

        const dataNilaiCluster2 = [];
        cluster2_temp.map(mhs => {
          mhs.data_nilai.map(e => {
            dataNilaiCluster2.push(e)
          })
        })

        const dataNilaiCluster3 = [];
        cluster3_temp.map(mhs => {
          mhs.data_nilai.map(e => {
            dataNilaiCluster3.push(e)
          })
        })

        const resultCluster1 = helpers.groupByKey(dataNilaiCluster1, 'matkul_id')
        const mappingResultCluster1 = Object.keys(resultCluster1).map(key => {
          return {
            matkul_id: key,
            matkul: resultCluster1[key][0].matkul,
            nilai: Number(((resultCluster1[key].map(e => e.nilai).reduce((a, b) => a + b, 0)) / resultCluster1[key].length).toFixed(8))
          }
        })

        const resultCluster2 = helpers.groupByKey(dataNilaiCluster2, 'matkul_id')
        const mappingResultCluster2 = Object.keys(resultCluster2).map(key => {
          return {
            matkul_id: key,
            matkul: resultCluster2[key][0].matkul,
            nilai: (resultCluster2[key].map(e => e.nilai).reduce((a, b) => a + b, 0)) / resultCluster2[key].length
          }
        })

        const resultCluster3 = helpers.groupByKey(dataNilaiCluster3, 'matkul_id')
        const mappingResultCluster3 = Object.keys(resultCluster3).map(key => {
          return {
            matkul_id: key,
            matkul: resultCluster3[key][0].matkul,
            nilai: (resultCluster3[key].map(e => e.nilai).reduce((a, b) => a + b, 0)) / resultCluster3[key].length
          }
        })

        cluster_akhir = {
          cluster1: {
            label: "C1",
            total: cluster1_temp.length,
            data_nilai: mappingResultCluster1
          },
          cluster2: {
            label: "C2",
            total: cluster2_temp.length,
            data_nilai: mappingResultCluster2
          },
          cluster3: {
            label: "C3",
            total: cluster3_temp.length,
            data_nilai: mappingResultCluster3
          },
        }
        clusters = cluster_akhir;
      } while (cluster_awal.cluster1.total !== cluster_akhir.cluster1.total && cluster_awal.cluster2.total !== cluster_akhir.cluster2.total && cluster_awal.cluster3.total !== cluster_akhir.cluster3.total)

      const data = {
        totalIterasi,
        data: tempMhsWithCluster1,
        cluster_akhir: cluster_akhir,
      }
      helpers.response(res, data, 200, null);
    } catch (error) {
      return helpers.response(res, null, 404, error.message);
    }
  }
}