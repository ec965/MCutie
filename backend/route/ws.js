const logger = require("../config/pino");
const mqtt = require("../mqtt/index");
const db = require("../models/index");
const { Op } = require("sequelize");
const mqttEmitter = require("../mqtt/event");

//packets sent from server
/*
{
  request: "newdata",
  payload:[{
    id: 0,
    message: "message",
    topic: "topic",
    createdAt: "2021-01-21T10:57:56.379Z"
   },{
    id: 1,
    message: "message",
    topic: "topic",
    createdAt: "2021-01-21T10:57:56.38Z"
   }]
}
*/
/*
{
  request: "newtopic",
  payload: [{topic: "newtopic"}, {topic: "newtopic2"}]
}
*/
module.exports = (wss) => {
  wss.on('connection', (ws) => {
    logger.debug("New websocket connection");

    // send new topics to the client
    var previousTopics = ""; // saves previous topics to check before sending to client
    var liveTopic;
    var prevMsgId = 0;
    var prevLiveTopic;
    
    mqttEmitter.on("MQTTRX", () => {
      console.log("new event");
      if (ws.readyState === ws.OPEN){
        db.sequelize.query("SELECT DISTINCT topic FROM `msgs`")
          .then( ([topics, metadata]) => {

            if( JSON.stringify(topics) !== previousTopics){
              logger.debug("[WS] sending new topic on websocket.");
              ws.send(JSON.stringify({
                response:"newtopic",
                payload: topics
              }));
            }

            previousTopics = JSON.stringify(topics);
          })
          .catch((e) => logger.error("[DB] Error updating live topics: " + e));
        

        if (liveTopic){
          if (liveTopic !== prevLiveTopic){
            prevMsgId = 0;
          }
          db.Msg.findAll({
            where: {
              topic: liveTopic,
              id: { [Op.gt]: prevMsgId},
            },
          })
            .then((msgs)=>{
              if (msgs.length > 0){
                prevMsgId = parseInt(msgs[msgs.length-1].id);
                logger.debug("[WS] sending new data on websocket.");
                ws.send(JSON.stringify({response: 'newdata', payload: {topic: liveTopic, messages: msgs}}));
              }
            })
            .catch((e) => logger.error("Error getting live msg from DB: " + e));
          
          prevLiveTopic = liveTopic;
        }
        
      }
    });
    
    mqttEmitter.emit('MQTTRX'); // force event on websocket init

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

              mqttEmitter.emit('MQTTRX'); // force event on live topic update
              
              logger.debug("Starting live topic");
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
}

// packet sent from CLIENT
/*
{
  request: "live",
  payload: {
    topic: "topic"
  }
}
*/
const checkTopicExist = async (msgjson) => {
  if (typeof msgjson.payload.topic !== "undefined"){
    let [topics, metadata] = await db.sequelize.query("SELECT DISTINCT topic FROM `msgs`")
    if (topics.length !== 0){
      return msgjson.payload.topic;
    }
  }
}

/* Publish packet send from client
{
  request: "publish",
  payload: {
    topic: "topic",
    message: "message",
    qos: "qos" // optional
  }
}
*/
const publish = (msgjson) => {
  if (typeof msgjson.payload.topic !== "undefined" && typeof msgjson.payload.message !== "undefined"){
    let qos=0;
    if (typeof msgjson.payload.qos !== "undefined"){
      let qosint = parseInt(msgjson.qos);
      if (0<= qosint && qosint <= 2){
        qos=qosint;
      }
    }

    mqtt.publish(msgjson.payload.topic, msgjson.payload.message, {qos: qos}, (err) => {
      if (err) logger.error("Error publishing message");
    });        
  } else {
    logger.debug("Invalid publish json at websocket: " + msg);
  } 
}
