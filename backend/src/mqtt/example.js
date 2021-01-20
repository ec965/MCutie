const mqtt = require("./index"); // mqtt
const db = require("../db/index");
const logger = require('../pino_cfg');


const add_subs_db = async () => {
  await db.client.sync({force:true});
}

add_subs_db().then(() => {
  mqtt.subscribe("hi");
})
.catch((e) => logger.error(e));


// module.exports = { client };
