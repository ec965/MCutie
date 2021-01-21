const mqtt = require("mqtt");
const db = require("../models/index");
const logger = require("../config/pino");

const subscribeAll = async (client) => {
  let subTopics = await db.Sub.findAll({attributes:['topic', 'qos']});
  if ( subTopics.length > 0 ){
    for (s of subTopics){
      client.subscribe(s.topic, {qos: s.qos}, (err, granted) => {
        logger.error("Error subscribing");
      });
    }
  }
}

module.exports = subscribeAll;