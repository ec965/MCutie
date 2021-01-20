const mqtt = require("mqtt"); // mqtt
const db = require("../db/index");
const logger = require('../pino_cfg');
const on_message = require('./on_msg');

const Broker = "mqtt://localhost:1883";
var connopts = {
  clientId: "mqtt_js_test",
  username: "test",
  password: "test123",
};


const add_subs_db = async () => {
  await db.client.sync({force:true});
  await db.mqtt_sub.subscribe_topic("#");
}




add_subs_db().then(() => {


  // connect mqtt client
  const client = mqtt.connect(Broker, connopts);

  // bind callbacks for mqtt

  // on connect, pull subscriptions from db and subscribe
  client.on("connect", () => {
    db.mqtt_sub.list_subscription_topics()
    .then((subscriptions) => {
      client.subscribe(subscriptions, (err) => {
        if (err) {
          logger.error("[MQTT] Error subscribing: ", err);
        }
      } )
    })
    .catch((e) => logger.error("[DB] Error subscribing: ", e));
  });

  // on reconnect
  client.on("reconnect", () =>
    logger.info("[MQTT] Disconnected, attempting to reconnect")
  );

  // on message
  client.on("message", (topic, message) => on_message(topic, message));

})
.catch((e) => logger.error(e));


// module.exports = { client };
