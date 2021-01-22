require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const db = require("./models/index"); 
const mqtt = require("./mqtt/index"); 
const logger = require("./config/pino");
const routes = require("./route/index");
const subscribeAll = require('./mqtt/sub');

const PORT = process.env.PORT || 5000;

db.sequelize.sync({force:false})
.then(subscribeAll(mqtt))
.catch((e) => logger.error("Error setting up the databse:", e));

// express routes
const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/mqtt", routes.mqtt);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});