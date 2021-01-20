const db = require("./src/db"); // db query wrappers
const mqtt = require("./src/mqtt"); // mqtt client setup
const logger = require("./src/pino_cfg");
const express = require("express"); // express
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const routes = require("./src/route");

const PORT = 5000;

const Subscriptions = ["esp32-temp/out/#", "esp32-temp/in/#"];

db.client.sync({force:false})
.then(() => {
  for (s of Subscriptions){
    mqtt.subscribe(s).catch((e) => logger.error("Error subscribing: ", e));
  }
})
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening at http://localhost:${PORT}`);
});