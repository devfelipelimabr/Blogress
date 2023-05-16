const Sequelize = require("sequelize");
const SensitiveData = require("../SensitiveData/SensitiveData");
const connection = new Sequelize(
  "blogress",
  SensitiveData.database.user,
  SensitiveData.database.password,
  {
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00",
  }
);

module.exports = connection;
