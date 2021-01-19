const express = require("express");
const db = require("./db");
const router = express.Router();

// get all unique mqtt topics in the db
router.get("/topics", (req, res) => {
  db.select_topics((err, rows) => {
    if (err) {
      logger.warn("[DB] Error selecting topics");
    } else {
      var topics = [];
      for (r of rows) {
        topics.push(r.topic);
      }
      res.send(topics);
    }
  });
});

// send mqtt data for topic
router.get("/", (req, res) => {
  if (req.query.t) {
    var topic = req.query.t;
    db.select_all(topic, (err, rows) => {
      if (err) {
        logger.warn("[DB] Error selecting rows for topic: " + topic);
      } else {
        res.send(rows);
      }
    });
  } else {
    res.end("No topic query parameter found.");
  }
});

module.exports = router;
