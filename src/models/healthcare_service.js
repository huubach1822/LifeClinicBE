const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('healthcare_service', {
    ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ID_healthcare_package: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'healthcare_package',
        key: 'ID'
      }
    },
    IsRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'healthcare_service',
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
        name: "ID_healthcare_package",
        using: "BTREE",
        fields: [
          { name: "ID_healthcare_package" },
        ]
      },
    ]
  });
};
