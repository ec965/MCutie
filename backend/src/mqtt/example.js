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
  const client = mqtt.create_client();

})
.catch((e) => logger.error(e));


// module.exports = { client };
