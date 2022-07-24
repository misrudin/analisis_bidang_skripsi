const groupByKey = (array, key) => {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
};

const pangkat = (value) => {
  return Math.pow(value, 2);
};

const getMin = (numbers) => {
  return Math.min(...numbers);
};

const response = (res, data, code, msg) => {
  let tempResult = {};
  tempResult.msg = msg || "Success";
  tempResult.code = code || 200;
  tempResult.data = data;
  res.setHeader("Content-Type", "application/json");
  return res.status(tempResult.code).json(tempResult);
};

const kelompokSkripsi = (cluster) => {
  switch (cluster) {
    case 'C1':
      return {
        kelompok: "Internet of Things",
        topik: ["Smart Cities, Smart Tourism dan IoT", "Monitoring dan Kendali jarak Jauh", "Sistem Terintegrasi"]
      };
    case 'C2':
      return {
        kelompok: "Artificial Intellegence",
        topik: ["Kecerdasan Buatan / Sistem Cerdas", "Data Mining", "Pengelolaan Citra", "Sistem Pakar"]
      };
    case 'C3':
      return {
        kelompok: "Software Engginering",
        topik: ["Sistem Informasi", "Desain Sistem Enterprise dan Pengembangannya", "Sistem Informasi dalam Mobile dan Digital", "Metodologi Rekayasa Perangkat Lunak", "Sistem Pendukung Keputusan", "Sistem Berbasis Pengetahuan", "UI/UX"]
      };
    default:
      return {
        kelompok: "Kamu tidak memiliki kelompok yang sesuai",
        topik: []
      };
  }
}

module.exports = {
  groupByKey,
  pangkat,
  getMin,
  response,
  kelompokSkripsi
};
