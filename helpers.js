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

module.exports = {
  groupByKey,
  pangkat,
  getMin,
  response,
};
