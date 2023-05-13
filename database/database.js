const Sequelize = require("sequelize");
const connection = new Sequelize("blogress", "root", "128145", {
  host: "localhost",
  dialect: "mysql",
  timezone: "-03:00"
});

module.exports = connection;
