const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedule', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Current_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Max_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ID_doctor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'doctor',
        key: 'ID'
      }
    },
    ID_healthcare_package: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'healthcare_package',
        key: 'ID'
      }
    },
    ID_time_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'time_type',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'schedule',
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
        name: "ID_doctor",
        using: "BTREE",
        fields: [
          { name: "ID_doctor" },
        ]
      },
      {
        name: "ID_healthcare_package",
        using: "BTREE",
        fields: [
          { name: "ID_healthcare_package" },
        ]
      },
      {
        name: "ID_time_type",
        using: "BTREE",
        fields: [
          { name: "ID_time_type" },
        ]
      },
    ]
  });
};
