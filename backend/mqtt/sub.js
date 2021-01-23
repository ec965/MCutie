const mqtt = require("mqtt");
const db = require("../models/index");
const logger = require("../config/pino");

const subscribeAll = async (client) => {
  let subTopics = await db.Sub.findAll({attributes:['topic', 'qos']});
  if ( subTopics.length > 0 ){
    for (s of subTopics){
      client.subscribe(s.topic, {qos: s.qos}, (err, granted) => {
        if (err) {
          logger.error("Error subscribing: " + err);
        }
        if (granted) {
          logger.info(`Subscribed to: ${JSON.stringify(granted)}`)        
        }
      });
    }
  }
}

module.exports = subscribeAll;