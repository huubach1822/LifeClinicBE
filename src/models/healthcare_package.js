const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('healthcare_package', {
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
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ID_clinic: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clinic',
        key: 'ID'
      }
    },
    ID_healthcare_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'healthcare_type',
        key: 'ID'
      }
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    MaxPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'healthcare_package',
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
        name: "ID_clinic",
        using: "BTREE",
        fields: [
          { name: "ID_clinic" },
        ]
      },
      {
        name: "ID_healthcare_type",
        using: "BTREE",
        fields: [
          { name: "ID_healthcare_type" },
        ]
      },
    ]
  });
};
