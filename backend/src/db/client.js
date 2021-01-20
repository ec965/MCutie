const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("sqlite:test.db", {
  // logging: false,
});

module.exports = sequelize;