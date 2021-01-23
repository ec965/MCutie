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


// 400: bad request
// 404: topic does not exist
// 200: destroyed
// 500: error deleting from db
router.delete("/t", (req,res) => {
  if (typeof req.body.topic !== "undefined"){
    db.Msg.destroy({
      where: {
        topic:req.body.topic
      }
    })
      .then((destroy) => {
        if (! destroy){
          res.sendStatus(404); // could not find item to destroy
        } else {
          res.sendStatus(200); // destroyed
        }

      })
      .catch((e)=>{
        logger.error(`Error deleting messages with topic ${req.body.topic}: ${e}`);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
})
;

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
  if (typeof req.body.topic !== "undefined"){
    // check for valid qos, qos must be 0, 1, or 2
    let qos = 0;
    if (typeof req.body.qos !== "undefined"){
      let qosInt = parseInt(req.body.qos);
      if (0 <= qosInt && qosInt <= 2){
        qos = qosInt;
      }
    }

    db.Sub.findOne({
      where:{
        topic:req.body.topic
      }
    })
    .then((sub) => {
      if (! sub){
        mqtt.subscribe(String(req.body.topic), {qos: qos}, (err, granted) => {
          if (err) {
            logger.error(`Error subscribing: ${err}`);
            res.sendStatus(502); // bad gateway to mqtt
            return;
          }
          if (granted){
            logger.debug(`Subscribed to: ${JSON.stringify(granted)}`);

            db.Sub.create({
              topic: req.body.topic,
              qos: qos,
            })
              .then((item) => {
                logger.debug(`Added to database: ${JSON.stringify(item)}`);
                res.sendStatus(200);
              })
              .catch((e) => {
                logger.error(`Error adding subscription to Database: ${e}`);
                res.sendStatus(500)
              });
          }
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
// if topic not found: 404
// if item to delete doenst exist: 404
// if error unsubscribing: 502
// if error deleting item from db: 500 
router.delete("/s", (req, res) => {
  if (typeof req.body.topic !== "undefined"){
    db.Sub.findAll({
      where:{topic: req.body.topic}
    })
    .then((rows) => {
      // if topic isn't found in the database
      if (rows.length === 0){
        res.sendStatus(404);
      } else {
        mqtt.unsubscribe(req.body.topic, (err) => {
          if (err) {
            res.sendStatus(502); // error unsubscribing
          } else {
            logger.debug(`Unsubscribed from: ${JSON.stringify(req.body.topic)}`);
            db.Sub.destroy({
              where:{
                topic: req.body.topic
              }
            })
              .then((destroy) => {
                if ( ! destroy ){
                  res.sendStatus(404); // couldn't find item to destroy
                } else {
                  res.sendStatus(200);
                }
              })
              .catch((e) => {
                logger.error(`Error deleting subscription: ${e}`);
                res.sendStatus(500);
              });
          }
        })
      }
    })
    .catch((e)=>{
      logger.error(`Error finding ${req.body.topic} for deletion.`);
      res.sendStatus(500);
    })
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
