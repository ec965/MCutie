const express = require("express");
const db = require("../db/index");
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

// get all subscribed topics
router.get("/s", (req, res) => {
  db.mqtt_sub.list_subscriptions()
    .then((topics) => res.status(200).send(topics))
    .catch((e) => {
      logger.warn("[DB] Error getting subscriptions: ", e);
      res.status(500).send({msg: "Server Error"});
    });
});

// send mqtt messages for topic
router.get("/m", (req, res) => {
  if (req.query.topic) {
    db.mqtt_msg.list_messages(req.query.topic)
      .then((msgs) => res.status(200).send(msgs))
      .catch((e) => {
        logger.warn(`[DB] Error getting messages for ${req.query.topic}: ${e}`);
        res.status(500).send({ msg: "Server Error" });
      });
  } else {
    res.status(400).send({msg: "Topic not found"});
  }
});

module.exports = router;
