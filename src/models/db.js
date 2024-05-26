const { Sequelize } = require('sequelize');
var initModels = require("./init-models");

const sequelize = new Sequelize('datn_database', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

var db = initModels(sequelize);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;



//npx sequelize-auto -o "./src/models" -d datn_database -h localhost -u root -p 3306 -x 1234 -e mysql --noAlias true 
