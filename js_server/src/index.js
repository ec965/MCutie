// pino logger
const pino = require('pino');
const formatters = {
    bindings (bindings) {
        return {}
    }
}
const logger = pino({
    prettyPrint:true,
    level: 'debug',
    formatters
});

const util = require('./util'); // isFloat and isInt utility

const express = require('express'); // express 
const cors = require('cors');
const PORT = 5000;

var sqlite3 = require('sqlite3').verbose(); // sqlite3 db
const db = require("./db"); // db query wrappers

var mqtt = require('mqtt'); // mqtt
const Broker = 'mqtt://localhost:1883';
const Subscriptions = [ "esp32-temp/out/#" , "esp32-temp/in/#"];
const FloatResoltuion = 0.1;
const IntResolution = 1;



// create the sqlite3 client and mqtt data table
var dbclient = new sqlite3.Database('mqtt.db');
db.create_table(dbclient);

// connect mqtt client
var connopts = {
    clientId: 'mqtt_js_test',
    username: 'test',
    password: 'test123'
}
mqttclient = mqtt.connect(Broker, connopts);
// bind callbacks for mqtt
mqttclient.on('connect', () => {
    mqttclient.subscribe(Subscriptions, (err) => {
        if (err) {
            logger.warn("[MQTT] Error subscribing");
        }
    });
});

mqttclient.on('reconnect', () => logger.info("[MQTT] Disconnected, attempting to reconnect"));

mqttclient.on('message', (topic, message) => {
    topic = String(topic);
    message = String(message); // messages can come in as bytes, but we want chars
    logger.debug("[MQTT] RX: " + topic + ": " + message);
    db.select_last(dbclient, topic, (err, row) => {
        if (err) {
            logger.warn(`[DB] Error selecting last row for topic: ${topic}`);
        } else {
            // We want to limit the amount of data that gets into the database
            let push_to_db = false;

            // if row is undefined, it means there's nothing in the db
            // so we should add the value
            if (typeof row === 'undefined') {
                push_to_db = true;
            // check values if they are strings
            } else if (isNaN(row.payload) && isNaN(message)){
                // check if current is equal to last
                // if they are equal, don't write to db
                if (String(row.payload) !== String(message) ){
                    push_to_db = true;
                }
            // check values if they are ints
            } else if (util.isInt(row.payload) && util.isInt(message)) {
                // check if the ints are too close based on IntResolution
                if (Math.abs(parseInt(row.payload) - parseInt(message) >= IntResolution)){
                    push_to_db = true;
                }
            // check values if they are floats
            // if data is smaller than the resolution, don't add it
            } else if (Math.abs(parseFloat(row.payload) - parseFloat(message)) >= FloatResoltuion){
                push_to_db = true;
            }

            if (push_to_db){
                logger.debug("[MQTT/DB] Saving last mqtt msg to db.");
                db.insert_mqtt(dbclient, Date.now(), topic, message);
            }
        }
    });
}); 

// express routes
const app = express();
app.use(cors());
app.get("/", (req, res) => {
    res.send('Hello World!');
});

// get all unique mqtt topics in the db
app.get("/mqtt/topics", (req, res) => {
    db.select_topics(dbclient, (err, rows) => {
        if (err) {
            logger.warn("[DB] Error selecting topics");
        } else {
            var topics = [];
            for (r of rows){
                topics.push(r.topic);
            }
            res.send(topics);
        }
    });
});

// send mqtt data for topic
app.get("/mqtt/q", (req, res) => {
    if (req.query.t){
        var topic = req.query.t
        db.select_all(dbclient, topic, (err, rows) => {
            if (err) {
                logger.warn("[DB] Error selecting rows for topic: " + topic);
            } else {
                res.send(rows);
            }
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening at http://localhost:${PORT}`);
});

// mqttclient.end();
// dbclient.close();