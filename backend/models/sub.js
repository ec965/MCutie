const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define('sub', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    topic: { type: DataTypes.TEXT, allowNull: false, unique: true },
    qos: {
      type: DataTypes.INTEGER, 
      defaultValue: 0,
      validate: {
        isValidQos(value){
          let val = parseInt(value);
          if (0 > val || val > 2){
            throw new Error("QoS must be 0, 1, or 2!");
          }
        }
      }
    },
  }, {
    timestamps: true,
  })
}