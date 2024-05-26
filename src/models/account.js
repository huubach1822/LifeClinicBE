const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Username: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Password: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ID_account_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'account_type',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'account',
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
        name: "ID_account_type",
        using: "BTREE",
        fields: [
          { name: "ID_account_type" },
        ]
      },
    ]
  });
};
