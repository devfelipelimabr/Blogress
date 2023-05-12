const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const port = 8080;

//Controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

//Models
const Article = require("./articles/Article");
const Category = require("./categories/Category");

//View engine
app.set("view engine", "ejs");

//Static
app.use(express.static("public"));

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database
connection
  .authenticate()
  .then(() => {
    console.log(`Database connection sucess!`);
  })
  .catch(() => {
    console.log(error);
  });

app.use("/", categoriesController);

app.use("/", articlesController);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`The server is connected on port - ${port}`);
});