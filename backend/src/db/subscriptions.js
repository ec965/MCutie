const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./client");

class Subscription extends Model {}
Subscription.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    topic: { type: DataTypes.TEXT, allowNull: false, unique: true },
  },
  {
    sequelize,
    modelName: "subscription",
  }
);

const subscribe_topic = async (topic_name) => {
  var sub = await Subscription.create({
    topic: topic_name,
  });
};

const unsubscribe_topic = async (topic_name) => {
  Subscription.destroy({
    where: {
      topic: topic_name,
    }
  });
};

// returns a raw query json of subscriptions
const list_subscriptions = async () => {
  var subs = await Subscription.findAll({});
  return subs;
};

// returns subscribed topics as an array of strings
const list_subscription_topics = async () => {
  var subs = await Subscription.findAll({
    attributes: ["topic"]
  });
  var sub_list = [];
  for (s of subs) {
    sub_list.push(s.topic);
  }
  return sub_list;
}

module.exports = {
  subscribe_topic,
  unsubscribe_topic,
  list_subscriptions,
  list_subscription_topics,
};
