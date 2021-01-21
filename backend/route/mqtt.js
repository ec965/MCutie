const express = require("express");
const db = require("../models/index");
const mqtt = require("../mqtt/index");
const logger = require("../config/pino");

const router = express.Router();
// get all mqtt topics
router.get("/t", (req, res) => {
  db.sequelize.query("SELECT DISTINCT topic FROM `msgs`")
    .then(([topics,metadata]) => res.status(200).send(topics))
    .catch((e) => {
      logger.error("Error getting topics: ", e);
      res.sendStatus(500);
    });
});


// get mqtt messages for topic
router.get("/m", (req, res) => {
  if (req.query.topic) {

    db.Msg.findAll({
      where: {
        topic: req.query.topic
      }
    })
      .then((msgs) => {
        res.status(200).send(msgs);
      })
      .catch((e) => {
        logger.error("Error getting messages for " + req.query.topic + ": " + e);
        res.statusStatus(500);
      })

  } else {
    res.status(404).send({msg: "Topic not found"});
  }
});

// get all subscribed topics
router.get("/s", (req, res) => {

  db.Sub.findAll()
    .then((subs) => {
      res.status(200).send(subs);
    })
    .catch((e) => {
      logger.warn("Error getting subscriptions: ", e);
      res.sendStatus(500);
    })
});

// subscribe to a new topic
// 1. check DB if topic already exists
// 2. if topic does not exist, subscribe to topic and add to db
// if bad payload: 400
// if subscription already exists: 400
// if failed to subscribe: 502
// if failed to add to DB: 500
router.post("/s", (req, res) => {
  if (typeof req.body.topic !== "undefined" && typeof req.body.qos !== "undefined"){
    db.Sub.findOne({
      where:{
        topic:req.body.topic
      }
    })
    .then((sub) => {
      if (! sub){
        mqtt.subscribe(req.body.topic, {qos: parseInt(req.body.qos)}, (err, granted) => {
          if (err) {
            logger.error("Error subscribing: ", err);
            res.sendStatus(502); // bad gateway to mqtt
            return;
          }
          db.Sub.create({
            topic: req.body.topic,
            qos: req.body.qos,
          })
            .then(() => res.sendStatus(200))
            .catch((e) => {
              logger.error("Error adding subscription to Database. Subscription likely already exists.")
              res.sendStatus(500)
            });
        });
      } else {
        res.sendStatus(400);
      }
    })
  } else {
    res.sendStatus(400);
  }
});

// ADD PUTS TO MODIFY QOS ON SUBSCRIBED TOPICS

// unsubscribe from a topic
// if no body.topic : 400
// if error unsubscribing: 502
// if item to delete doenst exist: 404
// if error deleting item from db: 500 
router.delete("/s", (req, res) => {
  if (typeof req.body.topic !== "undefined"){
    mqtt.unsubscribe(req.body.topic, (err) => {
      if (err) {
        res.sendStatus(502);
      } else {
        db.Sub.destroy({
          where:{
            topic: req.body.topic
          }
        })
          .then((destroy) => {
            if ( ! destroy ){
              res.sendStatus(404);
            }
            res.sendStatus(200);
          })
          .catch((e) => {
            logger.error("Error deleting subscription: ", e);
            res.sendStatus(500);
          });
      }
    })
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
