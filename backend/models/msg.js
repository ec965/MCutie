const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define('msg', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    topic: { type: DataTypes.TEXT, allowNull: false },
  }, {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  });
}