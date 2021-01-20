const db = require("../db/index");
const util = require("../util");
const logger = require('../pino_cfg');
// set to 0 to match values
// set to -1 to let all values through
const FloatResoltuion = 0.1;
const IntResolution = 1;

const on_message = (topic, message) => {
  topic = String(topic);
  message = String(message); // messages can come in as bytes, but we want chars
  logger.debug("[MQTT] RX: " + topic + ": " + message);

  db.mqtt_msg.get_last_msg(topic)
  .then((last) => {
    if (last !== null) {
      // don't push data to db if it doesn't pass the resolution test
      if (! check_data_resolution(last.message, message, FloatResoltuion, IntResolution)) {
        logger.debug("Last mqtt msg didn't pass resolution test");
        return;
      }
    }

    logger.debug("[DB] Saving last mqtt msg to db.");
    db.mqtt_msg.add_msg(topic, message)
    .catch((e) => logger.error("[DB] Error saving msg to db:", e));

  })
  .catch((e) =>
    logger.error(`[DB] Error getting last message for ${topic}: ${e}`)
  );
};


// check data to see if it meets the criteria for pushing to DB
// return true is data is OK
/* 
1. abs(last - current) >= IntResolution
2. abs(last - current) >= Float Resolution
*/
const check_data_resolution = (last, current, float_resolution, int_resolution) => {
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

if (require.main === module ) {
  console.log(check_data_resolution("kasdjlfjal2", "adkf2"));
}

module.exports = on_message;