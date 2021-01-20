const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("sqlite:test.db");

module.exports = sequelize;