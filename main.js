require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.SERVER_PORT || 3000;
const morgan = require("morgan");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(morgan("short"));

const router = require("./routers");
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`\n Cors Enable App Listen Port http://localhost:${port}`);
});
