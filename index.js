const SensitiveData = require("./SensitiveData/SensitiveData");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");
const port = 8080;

// Configuração das sessões
app.use(
  session({
    secret: SensitiveData.session.secret,
    cookie: { maxAge: 900000 }, // Tempo em milissegundos
  })
);

// Importação dos controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const userController = require("./users/UserController");

// Importação dos modelos
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

// Configuração do mecanismo de visualização
app.set("view engine", "ejs");

// Servir arquivos estáticos
app.use(express.static("public"));

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Autenticação com o banco de dados
connection
  .authenticate()
  .then(() => {
    console.log("Database connection successful!");
  })
  .catch((error) => {
    console.log(error);
  });

// Uso dos controllers
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);

// Rotas

app.get("/", async (req, res) => {
  try {
    const articles = await Article.findAll({
      order: [["id", "DESC"]],
      limit: 5,
    });
    const categories = await Category.findAll({
      order: [["title", "ASC"]],
    });
    res.render("index", { articles, categories });
  } catch (error) {
    res.redirect("/");
  }
});

app.get("/about", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.render("about", { categories });
  } catch (error) {
    res.redirect("/");
  }
});

app.get("/articles/:slug", async (req, res) => {
  const slug = req.params.slug;
  try {
    const article = await Article.findOne({
      where: {
        slug: slug,
      },
    });
    if (article != undefined) {
      const categories = await Category.findAll({
        order: [["title", "ASC"]],
      });
      res.render("article", { article, categories });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.redirect("/");
  }
});

app.get("/category/:slug", async (req, res) => {
  const slug = req.params.slug;
  try {
    const category = await Category.findOne({
      where: {
        slug: slug,
      },
      include: [{ model: Article }],
    });
    if (category != undefined) {
      const categories = await Category.findAll({
        order: [["title", "ASC"]],
      });
      res.render("index", {
        articles: category.articles,
        category,
        categories,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`The server is connected on port - ${port}`);
});
