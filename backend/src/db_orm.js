const { Sequelize, DataTypes, Model, Op } = require("sequelize");
const sequelize = new Sequelize("sqlite:test.db");

const test_connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to db");
  } catch (error) {
    console.error("Not connceted to db with error:", error);
  }
};

// stores all messages
class MqttMsg extends Model {}
MqttMsg.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    time: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("(strftime('%s', 'now'))"),
    },
    topicid: {
      type: DataTypes.INTEGER,
      references: {
        model: MqttTopic,
        key: "id",
      },
    },
    message: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: "MqttMsg",
    timestamps: false,
  }
);

// stores all topics
class MqttTopic extends Model {}
MqttTopic.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  topic: { type: DataTypes.TEXT, allownull: false },
},{
  sequelize,
  modelName: "MqttTopic"
});

// stores topics to subscribe to
class Subscription extends Model {}
SubTopic.init({
  id: { types: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  topicid: {
    type: DataTypes.INTEGER,
    references: {
      model: MqttTopic,
      key: "id",
    },
  },
},{
  sequelize,
  modelName: "Subscription"
});

const main = async () => {
  // create the table
  await MqttMsg.sync(); // this is an async function

  // create a new row
  await MqttMsg.create({ topic: "hello", message: "world" });
  await MqttMsg.create({ topic: "hello", message: "earth" });
  await MqttMsg.create({ topic: "bye", message: "earth" });

  // select a topic and return timestamp and message
  const topic = "hello";
  const rows = await MqttMsg.findAll({
    attributes: ["time", "message"],
    where: { topic: { [Op.like]: topic } },
  });
  console.log(JSON.stringify(rows, null, 2));

  // select all unique topics
  const topics = await select_topics();
  console.log(topics);

  // select last message for a topic
  const last = await MqttMsg.findAll({
    attributes: ["id", "message"],
    limit: 1,
    where: { topic: { [Op.like]: topic } },
    order: sequelize.literal("id DESC"),
  });
  console.log(JSON.stringify(last, null, 2));
};

main().catch((error) => console.error(error));

const select_topics = async () => {
  var query = await sequelize.query("SELECT DISTINCT topic FROM MqttMsgs");
  var topics = [];
  for (q of query[0]) {
    topics.push(q.topic);
  }
  return topics;
};

module.exports = { MqttMsg, select_topics };
