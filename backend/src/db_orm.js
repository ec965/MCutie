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

// stores all topics
class MqttTopic extends Model {}
MqttTopic.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    topic: { type: DataTypes.TEXT, allowNull: false, unique: true },
    subscribed: { type: DataTypes.INTEGER, defaultValue: true },
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


// create a topic or update subscription status
const subscribe_topic = async (topic_name) => {
  var topic = await MqttTopic.findOne({
    where: {
      topic: topic_name,
    }
  });
  if (topic == null){
    await MqttTopic.create({
      topic: topic_name,
    });
  } else {
    await MqttTopic.update(
      {subscribed: true },
      {where: {topic: topic_name }}
    );
  }
};

// unsubscribe from a topic
// delete the topic if it has no associated message or if delete_msgs is true
// deleting a topic should cascade and delete it's messages
const unsubscribe_topic = async (topic_name, delete_msgs = false) => {
  var topic = await MqttTopic.findOne({
    where: {
      topic: topic_name,
    },
    include: MqttMsg,
  });
  if (topic != null){
    if (topic.mqtt_msgs.length === 0 || delete_msgs) {
      await MqttTopic.destroy({
        where: {
          topic: topic_name,
        },
      });
    } else {
      await MqttTopic.update(
        { subscribed: false },
        { where: { topic: topic_name } }
      );
    }
  }
};

// create a new messgae in the db
const add_new_msg = async (topic, message) => {
  // find the topic id from the topic string
  var topicid = await MqttTopic.findOne({
    attributes: ["id"],
    where: {
      topic: topic
    }
  });
  var msg = await MqttMsg.create({
    mqttTopicId: topicid.id,
    message: message,
  });
}


// return an array of topic names and subscription status
const list_topics = async () => {
  var topics = await MqttTopic.findAll({
    attributes: ["topic", "subscribed"]
  });
  return topics;
}

const list_subscriptions = async () => {
  var topics = await MqttTopic.findAll({
    attributes: ["topic"],
    where: {
      subscribed: 1
    }
  })
  return topics;
}

// list messages for a given topic
const list_messages = async (topic) => {
  var topic_id = await MqttTopic.findOne({
    attributes: ["id"],
    where:{
      topic: topic
    }
  });
  var msgs = await MqttMsg.findAll({
    attributes: ["time", "message"],
    where: {
      mqttTopicId: topic_id.id
    }
  });
  return msgs;
}

// const main = async () => {
//   const msg1 = { topic: "hello", message: "world" };
//   const msg2 = { topic: "bye", message: "world" };
//   const msg3 = { topic: "hello", message: "earth" };
//   const msg4 = { topic: "bye", message: "earth" };
//   const msgs = [msg1, msg2, msg3, msg4];
//   const subs = ["hello", "bye"];
//   const unsubs = ["hello", "bye", "oops"];
//   // create the tables
//   await sequelize.sync({ force: true });

//   for (s of subs) {
//     await on_sub(s).catch((e) => console.error("Error subscribing: ", e));
//   }
//   // for (s of unsubs) {
//   //   await on_unsub(s).catch((e) => console.error("Error unsubscribing: ", e));
//   // }
//   for (m of msgs) {
//     await on_new_msg(m.topic, m.message).catch((e) => console.error("Error adding new msg:",e));
//   }

//   var rows = await MqttTopic.findAll({
//     include:MqttMsg
//   });
//   console.log(JSON.stringify(rows, null, 2));

//   await console.log(JSON.stringify(await list_topics(), null, 2));
//   for (s of unsubs) {
//     await on_unsub(s).catch((e) => console.error("Error unsubscribing: ", e));
//   }
//   await console.log(JSON.stringify(await list_subscriptions(), null, 2));
// };

// main().catch((error) => console.error(error));

module.exports = {
  subscribe_topic,
  unsubscribe_topic,
  add_new_msg,
  list_subscriptions,
  list_topics,
  list_messages
} 