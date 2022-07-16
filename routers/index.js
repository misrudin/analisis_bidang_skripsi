const express = require('express');
const Router = express.Router();

const analisis = require('./analisis');
Router.use('/analisis', analisis);

module.exports = Router;