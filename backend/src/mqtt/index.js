const mqtt = require("mqtt"); // mqtt
const db = require("../db/index");
const logger = require('../pino_cfg');
const on_message = require('./on_msg');

const Broker = "mqtt://localhost:1883";
var connopts = {
  clientId: "mcutie-0",
  username: "test",
  password: "test123",
};

// connect mqtt client
const client = mqtt.connect(Broker, connopts);

// bind callbacks for mqtt

// on connect, pull subscriptions from db and subscribe
client.on("connect", () => {
  subscribe_all();
});

// on reconnect
client.on("reconnect", () => {
  logger.info("[MQTT] Disconnected, attempting to reconnect");
});

// on message
client.on("message", (topic, message) => on_message(topic, message));


// subscribe to all topics in the DB
const subscribe_all = () => {
  db.mqtt_sub.list_subs()
  .then((subscriptions) => {
    for (s of subscriptions){
      client.subscribe(s.topic, {qos: s.qos}, (err) => {
        if (err) logger.error("[MQTT] Error subscribing: ", err);
      });
    }
  })
  .catch((e) => logger.error("[DB] Error subscribing, possibly nothig in the databse: ", e));
}

// add a new subscription to the db and subscribe to it
const subscribe = async (topic, qos=0) => {
  await db.mqtt_sub.create_sub(topic, qos);
  sub = await db.mqtt_sub.get_sub(topic);
  
  client.subscribe(sub.topic, {qos: sub.qos}, (err) => {
    if (err) { 
      logger.error("[MQTT] Error subscribing: ", err);
      return false;
  }
  });
  return true;
}

const unsubscribe = async (topic) => {
  // check if subscription exists in db
  var sub = await db.mqtt_sub.get_sub(topic)
  console.log(sub);
  if (!sub){
    return -2;
  } else {
    client.unsubscribe(topic, (err) => {
      if (err) return -1;
    });
    await db.mqtt_sub.remove_sub(topic);
    return 0;
  }
}

module.exports = {client, subscribe, unsubscribe}; 
