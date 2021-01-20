const db = require("../db/index");
const util = require("../util");
const logger = require('../pino_cfg');
const FloatResoltuion = 0.1;
const IntResolution = 1;

const on_message = (topic, message) => {
  topic = String(topic);
  message = String(message); // messages can come in as bytes, but we want chars
  logger.debug("[MQTT] RX: " + topic + ": " + message);

  db.mqtt_msg.get_last_message(topic)
  .then((last) => {
    if (last !== null) {
      if (! check_data_resolution(last.message, message)) return;
      logger.debug("last is not null");
    }

    logger.debug("[DB] Saving last mqtt msg to db.");
    db.mqtt_msg.add_new_msg(topic, message)
    .catch((e) => logger.error("[DB] Error saving msg to db:", e));

  })
  .catch((e) =>
    logger.error(`[DB] Error getting last message for ${topic}: ${e}`)
  );
};


// check data to see if it meets the criteria for pushing to DB
/* 
1. last != current
2. abs(last - current) >= IntResolution
3. abs(last - current) >= Float Resolution
*/
const check_data_resolution = (last, current) => {
  // check values if they are strings
  // check if current is equal to last
  // if they are equal, don't write to db
  if (isNaN(last) && isNaN(current)) {
    if (String(last) !== String(current)) {
      return true;
    }
  }
  // check values if they are ints
  // then check if the ints are too close based on IntResolution
  else if (util.isInt(last) && util.isInt(current)) {
    if (Math.abs(parseInt(last) - parseInt(current) >= IntResolution)) {
      return true;
    }
  }
  // check values if they are floats
  // if data is smaller than the resolution, don't add it
  else if (
    Math.abs(parseFloat(last) - parseFloat(current)) >= FloatResoltuion
  ) {
    return true;
  }

  return false;
};

module.exports = on_message;