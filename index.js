const SensitiveData = require("./SensitiveData/SensitiveData");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");
const port = 8080;

//Sessions
app.use(
  session({
    secret: SensitiveData.session.secret,
    cookie: { maxAge: 3000000 }, //Tempo em milisegundos
  })
);

//Controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const userController = require("./users/UserController");

//Models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

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
app.use("/", userController);

//Rotas

app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
    limit: 5,
  }).then((articles) => {
    Category.findAll({
      order: [["title", "ASC"]],
    }).then((categories) => {
      res.render("index", { articles: articles, categories: categories });
    });
  });
});

app.get("/about", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("about", { categories: categories });
  });
});

app.get("/articles/:slug", (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll({
          order: [["title", "ASC"]],
        }).then((categories) => {
          res.render("article", { article: article, categories: categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  const slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll({
          order: [["title", "ASC"]],
        }).then((categories) => {
          res.render("index", {
            articles: category.articles,
            category: category,
            categories: categories,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

app.listen(port, () => {
  console.log(`The server is connected on port - ${port}`);
});
