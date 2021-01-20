const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./client");

class Subscription extends Model {}
Subscription.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    topic: { type: DataTypes.TEXT, allowNull: false, unique: true },
    qos: {type: DataTypes.INTEGER},
  },
  {
    sequelize,
    modelName: "subscription",
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
);

// add a subscription topic to the db
// checks if the topic exists before adding it
const create_sub = async (topic_name, qos=0) => {
  var check = await Subscription.findAll({
    where:{
      topic: topic_name,
    }
  });
  if (check.length === 0){
    var sub = await Subscription.create({
      topic: topic_name,
      qos : qos,
    });
    return true;
  } else {
    return false;
  }
};

const remove_sub = async (topic_name) => {
  Subscription.destroy({
    where: {
      topic: topic_name,
    }
  });
};

// returns a raw query json of subscriptions
const list_subs = async () => {
  var subs = await Subscription.findAll({});
  return subs;
};

const get_sub = async (topic) => {
  var sub = await Subscription.findAll({
    where: {
      topic: topic,
    }
  });
  if (sub[0]) return sub[0];

  return false;
}

module.exports = {
  create_sub,
  remove_sub,
  list_subs,
  get_sub,
};
