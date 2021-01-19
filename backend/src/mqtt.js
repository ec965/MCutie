const mqtt = require('mqtt'); // mqtt
const db = require('./db');
const Broker = 'mqtt://localhost:1883';
const Subscriptions = [ "esp32-temp/out/#" , "esp32-temp/in/#"];
const FloatResoltuion = 0.1;
const IntResolution = 1;

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

// connect mqtt client
var connopts = {
    clientId: 'mqtt_js_test',
    username: 'test',
    password: 'test123'
}
const client = mqtt.connect(Broker, connopts);
// bind callbacks for mqtt
client.on('connect', () => {
    client.subscribe(Subscriptions, (err) => {
        if (err) {
            logger.warn("[MQTT] Error subscribing");
        }
    });
});

client.on('reconnect', () => logger.info("[MQTT] Disconnected, attempting to reconnect"));

client.on('message', (topic, message) => {
    topic = String(topic);
    message = String(message); // messages can come in as bytes, but we want chars
    logger.debug("[MQTT] RX: " + topic + ": " + message);
    db.select_last(topic, (err, row) => {
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
                db.insert_mqtt( Date.now(), topic, message);
            }
        }
    });
}); 

module.exports = {client};