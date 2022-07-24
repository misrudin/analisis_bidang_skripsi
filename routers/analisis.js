const express = require("express");
const Router = express.Router();
const controller = require("../controller/analisis");

Router.get("/", controller.getAnalisis);
Router.get("/laporan-bidang-skripsi", controller.getLaporanAnalisis);
Router.get("/tren-bidang-skripsi", controller.getTrenBidangSkripsi);
Router.post("/save-result", controller.saveResult);
Router.post("/save-result-no-delete", controller.saveResultNoDelete);
Router.get("/bidang-skripsi", controller.getBidangSkripsi);

module.exports = Router;
