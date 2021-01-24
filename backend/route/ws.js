const logger = require("../config/pino");
const mqtt = require("../mqtt/index");
const db = require("../models/index");

module.exports = (wss) => {
  wss.on('connection', (ws) => {
    logger.debug("New websocket connection");
    var liveTopic;

    setInterval(()=>{
      if (liveTopic && ws.readyState === ws.OPEN){
        db.Msg.findAll({
          where: {
            topic:liveTopic
          }
        })
          .then((msgs) => {
            ws.send(JSON.stringify({response:"data", data:msgs}));
          })
          .catch((e) => logger.error("Error sending messages on Websocket: " + e));
        
        db.sequelize.query("SELECT DISTINCT topic FROM `msgs`")
          .then(([topics,metadata]) => {
            ws.send(JSON.stringify({response: "new topics", data:topics}));
          })
          .catch((e) => {
            logger.error("Error sending new topics on Websocket: ", e);
          });

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
              logger.debug("Starting live topic");
              db.Msg.findAll({
                where: {
                  topic:liveTopic
                }
              })
                .then((msgs) => {
                  ws.send(JSON.stringify(msgs));
                })
                .catch((e) => logger.error("Error sending messages on Websocket: " + e));
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