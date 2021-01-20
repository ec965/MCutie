const db = require("./src/db"); // db query wrappers
const mqtt = require("./src/mqtt"); // mqtt client setup
const logger = require("./src/pino_cfg");
const express = require("express"); // express
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./src/route");

const PORT = 5000;

const Subscriptions = ["esp32-temp/out/#", "esp32-temp/in/#"];

// init db and mqtt client
const setup = async () => {
  await db.client.sync();
  for (s of Subscriptions){
    await db.mqtt_sub.subscribe_topic(s);
  }
  return mqtt.create_client();
}

mqtt_client = setup().catch((e) => logger.error(e));

// express routes
const app = express();
app.use(cors());
app.use(helmet());

app.use("/mqtt", routes.mqtt);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening at http://localhost:${PORT}`);
});