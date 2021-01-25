const db = require("../models/index");
const logger = require('../config/pino');
const mqttEmitter = require('./event');

// set to 0 to match values
// set to -1 to let all values through
const FloatResoltuion = process.env.MQTT_FLOAT_RES || 0.1;
const IntResolution = process.env.MQTT_INT_RES || 1;


const onMessage = async (topic, message) => {
  
  topic = String(topic);
  message = String(message); // messages can come in as byte arrays, but we want strings 
  logger.debug("[MQTT] RX: " + topic + ": " + message);

  const lastMsg = await db.Msg.findOne({
    where: {
      topic:topic
    },
    order: db.sequelize.literal('id DESC'),
    limit:1
  });

  // check the last message against the new message, only add the new message if it passes the resolution test.
  if ( lastMsg !== undefined && lastMsg !== null){
    if ( ! checkDataResolution(lastMsg.message, message, FloatResoltuion, IntResolution)) {
      logger.debug("Last mqtt msg didn't pass resolution test.");
      return;
    }
  }

  logger.debug("Saving last mqtt msg to database.");
  await db.Msg.create({message: message, topic: topic});
  mqttEmitter.emit('MQTTRX'); // notify the websocket that a new message has been added to the db
}


// check data to see if it meets the criteria for pushing to DB
// return true is data is OK
/* 
1. abs(last - current) >= IntResolution
2. abs(last - current) >= Float Resolution
*/
const checkDataResolution = (last, current, float_resolution, int_resolution) => {
  // check values if they are floats
  // if data is smaller than the resolution, don't add it
  last_float = parseFloat(last);
  current_float = parseFloat(current);
  if (last_float % 1 > 0 || current_float % 1 > 0){
    if (Math.abs(last_float - current_float) <= float_resolution) {
      return false;
    }
  }
  // check values if they are ints
  // then check if the ints are too close based on IntResolution
  last_int = parseInt(last);
  current_int = parseInt(current);
  if (Math.abs(last_int - current_int) <= int_resolution) {
    return false;
  }
  return true;
}

module.exports = onMessage;