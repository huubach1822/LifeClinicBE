const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ID_booking: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'booking',
        key: 'ID'
      }
    },
    Payment_method: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Status: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Payment_date: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'payment',
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
