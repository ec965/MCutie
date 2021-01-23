const express = require('express');
const logger = require("../config/pino");
const mqtt = require("../mqtt/index");
const MqttQ = require("../mqtt/queue");
const db = require("../models/index");

const router = express.Router();

// Publish message JSON:
// qos is optional
/*
{
  "request":"publish", 
  "topic":"<TOPIC>", 
  "message":"<MESSAGE>", 
  "qos": "<QOS>"
}
*/
// start live topic JSON:
/*
{
  "request":"live",
  "topic": "<TOPIC>"
}
*/
router.ws('/', (ws, req) => {
  let liveTopic;

  setInterval(()=>{
    if (liveTopic && ws.readyState === ws.OPEN){
      db.Msg.findAll({
        where: {
          topic:liveTopic
        }
      })
        .then((msgs) => {
          ws.send(JSON.stringify(msgs));
        })
        .catch((e) => logger.error("Error sending messages on Websocket: " + e));
    }
  }, 1000);

  ws.on('message', (msg) => {
    try{
      var msgjson = JSON.parse(msg);
      if (typeof msgjson.request !== "undefined"){
        if (msgjson.request === "publish"){
          publish(msgjson);
        }
        if (msgjson.request === "live"){
          checkTopicExist(msgjson)
          .then((topic) => {
            liveTopic = topic;
            console.log(liveTopic);
            console.log("Starting live topic");
          })
          .catch((e)=> logger.error("Error checking topic at websocket: " + e));

        }
      }
    } catch(e) {
      logger.debug("Invalid json at websocket: " + msg + "\nError: " + e);
    }
  });
  ws.on('close', ()=> {
    logger.debug("Websocket closed.");
  });
});

const checkTopicExist = async (msgjson) => {
  if (typeof msgjson.topic !== "undefined"){
    let [topics, metadata] = await db.sequelize.query("SELECT DISTINCT topic FROM `msgs`")
    if (topics.length !== 0){
      return msgjson.topic;
    }
  }
}

const publish = (msgjson) => {
  if (typeof msgjson.topic !== "undefined" && typeof msgjson.message !== "undefined"){
    let qos=0;
    if (typeof msgjson.qos !== "undefined"){
      let qosint = parseInt(msgjson.qos);
      if (0<= qosint && qosint <= 2){
        qos=qosint;
      }
    }

    mqtt.publish(msgjson.topic, msgjson.message, {qos: qos}, (err) => {
      if (err) logger.error("Error publishing message");
    });        
  } else {
    logger.debug("Invalid publish json at websocket: " + msg);
  } 
}
module.exports = router;