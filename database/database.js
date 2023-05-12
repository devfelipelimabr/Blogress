const Sequelize = require("sequelize");
const connection = new Sequelize("blogress", "root", "128145", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
