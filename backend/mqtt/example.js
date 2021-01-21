const mqtt = require("./index"); // mqtt
const logger = require('../config/pino');
const db = require('../models/index');

db.sequelize.sync({force:true})
  .then(() => {
    mqtt.subscribe("hi");
    // mqtt.unsubscribe("hi");
  })
  .catch((e) => logger.error('Error: ', e));

