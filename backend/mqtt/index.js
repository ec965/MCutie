const mqtt = require("mqtt"); // mqtt
const logger = require('../config/pino');
const onMessage = require('./msg');
const subscribeAll = require('./sub');

const Broker = process.env.MQTT_BROKER || "mqtt://localhost:1883";
var connOpts = {
  clientId: process.env.MQTT_CLIENTID || "mcutie-0",
  username: process.env.MQTT_USERNAME || "",
  password: process.env.MQTT_PASSWORD || "",
};

// connect mqtt client
const client = mqtt.connect(Broker, connOpts);

// bind callbacks for mqtt

// on connect, pull subscriptions from db and subscribe
client.on("connect", () => {
  subscribeAll()
    .catch((e) => logger.error("Error subscribing all (ignore this error on startup):" + e));
    //usually this error gets thrown b/c subscribeAll() checks the db before it is intialized.
});

// on reconnect
client.on("reconnect", () => {
  logger.info("MQTT disconnected, attempting to reconnect");
});

// on message
client.on("message", (topic, message) => {
  onMessage(topic, message)
    .catch((e) => logger.error("Error processing MQTT message: " + e))
});

module.exports = client; 
