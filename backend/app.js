const util = require("./src/util"); // isFloat and isInt utility
const db = require("./src/db"); // db query wrappers
const mqtt = require("./src/mqtt"); // mqtt client setup
const pino = require("pino");
const express = require("express"); // express
const cors = require("cors");
const helmet = require("helmet");
const mqtt_routes = require("./src/mqtt_routes");

const PORT = 5000;

// pino logger
const formatters = {
  bindings(bindings) {
    return {};
  },
};
const logger = pino({
  prettyPrint: true,
  level: "debug",
  formatters,
});

// ensure mqtt_log table exists
db.create_table();

// express routes
const app = express();
app.use(cors());
app.use(helmet());

app.use("/mqtt", mqtt_routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

// mqtt.client.end();
// db.client.close();
