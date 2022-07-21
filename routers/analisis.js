const express = require("express");
const Router = express.Router();
const controller = require("../controller/analisis");

Router.get("/", controller.getAnalisis);
Router.get("/laporan-bidang-skripsi", controller.getLaporanAnalisis);
Router.get("/tren-bidang-skripsi", controller.getTrenBidangSkripsi);
Router.post("/save-result", controller.saveResult);

module.exports = Router;
