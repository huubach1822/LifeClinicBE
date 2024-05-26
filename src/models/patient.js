const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('patient', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    DateOfBirth: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Phone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Gender: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Health_insurance_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Ethnicity: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Citizen_id_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ID_account: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'account',
        key: 'ID'
      }
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'patient',
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
        name: "ID_account",
        using: "BTREE",
        fields: [
          { name: "ID_account" },
        ]
      },
    ]
  });
};
