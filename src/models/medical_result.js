const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('medical_result', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Result: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ID_booking: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'booking',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'medical_result',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "ID_booking",
        using: "BTREE",
        fields: [
          { name: "ID_booking" },
        ]
      },
    ]
  });
};
