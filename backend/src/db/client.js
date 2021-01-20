const { Sequelize } = require("sequelize");
const logger = require("../pino_cfg");

const sequelize = new Sequelize("sqlite:test.db", {
  logging: msg => logger.trace(msg),
});

module.exports = sequelize;