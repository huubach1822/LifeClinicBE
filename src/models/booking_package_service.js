const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('booking_package_service', {
    ID_booking: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'booking',
        key: 'ID'
      }
    },
    ID_healthcare_service: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'healthcare_service',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'booking_package_service',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_booking" },
          { name: "ID_healthcare_service" },
        ]
      },
      {
        name: "ID_healthcare_service",
        using: "BTREE",
        fields: [
          { name: "ID_healthcare_service" },
        ]
      },
    ]
  });
};
