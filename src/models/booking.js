const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('booking', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Status: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Booking_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ID_patient: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'patient',
        key: 'ID'
      }
    },
    ID_schedule: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'schedule',
        key: 'ID'
      }
    },
    Total_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'booking',
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
        name: "ID_patient",
        using: "BTREE",
        fields: [
          { name: "ID_patient" },
        ]
      },
      {
        name: "ID_schedule",
        using: "BTREE",
        fields: [
          { name: "ID_schedule" },
        ]
      },
    ]
  });
};
