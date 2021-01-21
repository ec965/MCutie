const { Sequelize } = require("sequelize");
const MsgModel = require("./msg");
const SubModel = require('./sub');
const logger = require("../config/pino");

const sequelize = new Sequelize(process.env.DB_HOST || "sqlite:test.db", {
  logging: msg => logger.debug(msg),
});

const Msg = MsgModel(sequelize);
const Sub = SubModel(sequelize);

module.exports = {
  sequelize,
  Msg,
  Sub,
};