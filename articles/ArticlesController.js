const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const Article = require("./Article");
const Category = require("../categories/Category");

router.get("/articles", (req, res) => {
  res.send("ROTA DE ARTIGOS");
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories: categories });
  });
});

router.post("/articles/save", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const categoryId = req.body.category;
  if (title != undefined && body != undefined) {
    Article.create({
      title: title,
      slug: slugify(title),
      body: body,
      categoryId: categoryId,
    }).then(() => {
      res.redirect("/admin/articles");
    });
  } else {
    res.redirect("admin/articles/new");
  }
});

module.exports = router;
