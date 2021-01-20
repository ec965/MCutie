const { Sequelize, DataTypes, Model } = require("sequelize");
const { mqtt_msg } = require(".");
const sequelize = require("./client");

// stores all topics
class MqttTopic extends Model {}
MqttTopic.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    topic: { type: DataTypes.TEXT, allowNull: false, unique: true },
  },
  {
    sequelize,
    modelName: "mqtt_topic",
  }
);

// stores all messages
class MqttMsg extends Model {}
MqttMsg.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    time: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("(strftime('%s', 'now'))"), // set time as unix time
    },
    message: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: "mqtt_msg",
    timestamps: false,
  }
);
// msg should have the fk pointing to topic id
MqttTopic.hasMany(MqttMsg, {
  onDelete: "CASCADE",
});
MqttMsg.belongsTo(MqttTopic);

// SEE IF THIS CAN BE A HOOK
// returns the id of the given topic_name
// if topic doesn't exist, then create a new topic
const get_topic_id = async (topic_name) => {
  var topic_id = await MqttTopic.findOne({
    attributes: ["id"],
    where: {
      topic: topic_name,
    },
  });
  if (topic_id === null){
    topic_id = await MqttTopic.create({
      topic: topic_name
    })
  }
  return topic_id.id;
};

// create a new messgae in the db
const add_new_msg = async (topic, message) => {
  var msg = await MqttMsg.create({
    mqttTopicId: await get_topic_id(topic),
    message: message,
  });
};

// return an array of topic names and subscription status
const list_topics = async () => {
  var topics = await MqttTopic.findAll({
    attributes: ["topic"],
  });
  return topics;
};

// list messages for a given topic
const list_messages = async (topic) => {
  var msgs = await MqttTopics.findAll({
    where: {
      topic: topic
    },
    include: MqttMsg,
  });
  return msgs;
};

const get_last_message = async (topic) => {
  var msg = await MqttMsg.findOne({
    attributes: ["time", "message"],
    where: {
      mqttTopicId: await get_topic_id(topic),
    },
    order: sequelize.literal("id Desc"),
    limit: 1,
  });
  return msg;
};

module.exports = {
  add_new_msg,
  list_topics,
  list_messages,
  get_last_message,
};
