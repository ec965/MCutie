const express = require("express");
const db = require("../db/index");
const mqtt = require("../mqtt/index");
const logger = require("../pino_cfg");

const router = express.Router();
// get all mqtt topics
router.get("/t", (req, res) => {
  db.mqtt_msg.list_topics()
    .then((topics) => res.status(200).send(topics))
    .catch((e) =>{
      logger.warn("[DB] Error getting topics:", e);
      res.status(500).send({msg: "Server Error"})
    });
});


// send mqtt messages for topic
router.get("/m", (req, res) => {
  if (req.query.topic) {
    db.mqtt_msg.list_msgs(req.query.topic)
      .then((msgs) => res.status(200).send(msgs))
      .catch((e) => {
        logger.warn(`[DB] Error getting messages for ${req.query.topic}: ${e}`);
        res.status(500).send({ msg: "Server Error" });
      });
  } else {
    res.status(404).send({msg: "Topic not found"});
  }
});

// get all subscribed topics
router.get("/s", (req, res) => {
  db.mqtt_sub.list_subs()
    .then((topics) => res.status(200).send(topics))
    .catch((e) => {
      logger.warn("[DB] Error getting subscriptions: ", e);
      res.status(500).send({msg: "Server Error"});
    });
});

// subscribe to a new topic
router.post("/s", (req, res) => {
  if (typeof req.body.topic !== "undefined" && typeof req.body.qos !== "undefined"){
    mqtt.subscribe(req.body.topic, req.body.qos)
    .then(() => res.sendStatus(201))
    .catch((e) => {
      logger.error("Error subscribing: ", e);
      res.status(500).send({msg: "Server Error"});
    });
  } else {
    res.status(404).send({msg: "Bad request"});
  }
});

// unsubscribe from a topic
router.delete("/s", (req, res) => {
  if (typeof req.body.topic !== "undefined"){
    mqtt.unsubscribe(req.body.topic)
    .then((ok) => {
      console.log(ok);
      if(ok === -2){
        res.sendStatus(404);
      } else if (ok === -1){
        logging.error("Error unsubscribing from ", topic);
        res.sendStatus(500);
      } else if (ok === 0){
        res.sendStatus(201);
      }
    })
    .catch((e) => {
      res.sendStatus(500);
    })
  } else {
    res.sendStatus(404);
  }
})

module.exports = router;
