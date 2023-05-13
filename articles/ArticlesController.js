const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const Article = require("./Article");

router.get("/articles", (req, res) => {
  res.send("ROTA DE ARTIGOS");
});

router.get("/admin/articles/new", (req, res) => {
  res.render("admin/articles/new");
});

router.post("/articles/save", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  if ((title && body) != undefined) {
    Article.create({
      title: title,
      slug: slugify(title),
      body: body,
    }).then(() => {
      res.redirect("/admin/articles");
    });
  } else {
    res.redirect("admin/articles/new");
  }
});

module.exports = router;
