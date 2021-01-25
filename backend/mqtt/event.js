const EventEmitter = require('events');
class MqttEmitter extends EventEmitter{}
const mqttEmitter = new MqttEmitter;

module.exports = mqttEmitter;