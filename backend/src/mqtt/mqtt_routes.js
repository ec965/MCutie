const express = require("express");
const db = require("../db/index");
const router = express.Router();

// get all mqtt topics in the db with subscribed status
router.get("/topics", (req, res) => {
  db.list_topics()
    .then((topics) => res.status(200).send(topics))
    .catch((e) => logger.warn("[DB] Error getting topics:", e));
});

// get all subscribed topics
router.get("/subscriptions", (req, res) => {
  db.list_subscriptions()
    .then((topics) => res.status(200).send(topics))
    .catch((e) => logger.warn("[DB] Error getting subscriptions: ", e));
});

// send mqtt data for topic
router.get("/", (req, res) => {
  if (req.query.topic) {
    db.list_messages(req.query.topic)
      .then((msgs) => res.status(200).send(msgs))
      .catch((e) => {
        logger.warn(`[DB] Error getting messages for ${req.query.topic}: ${e}`);
        res.status(400).send({ msg: "Topic not found" });
      });
  }
});

module.exports = router;
