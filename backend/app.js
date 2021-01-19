const util = require('./src/util'); // isFloat and isInt utility
const db = require("./src/db"); // db query wrappers
const mqtt = require("./src/mqtt"); // mqtt functions
const pino = require('pino');
const express = require('express'); // express 
const cors = require('cors');
const helmet = require('helmet');

const PORT = 5000;

// pino logger
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

// create the mqtt data table
db.create_table();

// express routes
const app = express();
app.use(cors());
app.use(helmet());
app.get("/", (req, res) => {
    res.send('Hello World!');
});

// get all unique mqtt topics in the db
app.get("/mqtt/topics", (req, res) => {
    db.select_topics( (err, rows) => {
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
        db.select_all(topic, (err, rows) => {
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

// mqtt.client.end();
// db.client.close();
