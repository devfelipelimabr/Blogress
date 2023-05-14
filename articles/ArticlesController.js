const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const Article = require("./Article");
const Category = require("../categories/Category");

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render("admin/articles/index", {
      articles: articles,
    });
  });
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

router.post("/articles/delete", (req, res) => {
  const id = req.body.id;
  if (id != undefined && id != isNaN) {
    Article.destroy({
      where: {
        id: id,
      },
    }).then(() => {
      res.redirect("/admin/articles");
    });
  } else {
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.redirect("/admin/articles");
  }

  Article.findByPk(id)
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("admin/articles/edit", {
            article: article,
            categories: categories,
          });
        });
      } else {
        res.redirect("/admin/articles");
      }
    })
    .catch((erro) => {
      res.redirect("/admin/articles");
    });
});

router.post("/articles/update", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const body = req.body.body;
  const categoryId = req.body.category;

  Article.update(
    { title: title, slug: slugify(title), body: body, categoryId: categoryId },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/admin/articles");
  });
});

module.exports = router;
