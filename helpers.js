const groupByKey = (array, key) => {
  return array
    .reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)})
    }, {})
}

const pangkat = (value) => {
  return Math.pow(value, 2)
}

const getMin = (numbers) => {
  return Math.min(...numbers)
}

const response = (res, dataResult, status, err) => {
  let resultPrint = {};
  resultPrint.status = 'Success';
  resultPrint.status_code = status;
  resultPrint.result = dataResult;
  resultPrint.err = err || null;
  return res.status(resultPrint.status_code).json(resultPrint);
}

module.exports = {
  groupByKey,
  pangkat,
  getMin,
  response
}