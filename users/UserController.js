const express = require("express");
const router = express.Router();
const User = require("./User");

router.get("/admin/users/new", (req, res) => {
  res.render("admin/users/new");
});

router.post("/users/save", (req, res) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((emailConfirm) => {
      if (emailConfirm === null) {
        User.create({ fullName: fullName, email: email, password: password })
          .then(() => {
            res.redirect("/admin/users");
          })
          .catch((err) => {
            // Lida com erros na criação do usuário
            console.error("Erro ao criar usuário: ", err);
            res.redirect("/admin/users/new");
          });
      } else {
        res.send(
          '<script>alert("Email já cadastrado."); window.location.href = "/admin/users/new";</script>'
        );
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar email: ", err);
      res.redirect("/admin/users/new");
    });
});

router.get("/admin/users", (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", {
      users: users,
    });
  });
});

router.post("/users/delete", (req, res) => {
  const id = req.body.id;
  if (id != undefined && id != isNaN) {
    User.destroy({
      where: {
        id: id,
      },
    }).then(() => {
      res.redirect("/admin/users");
    });
  } else {
    res.redirect("/admin/users");
  }
});

router.get("/admin/users/edit/:id", (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.redirect("/admin/users");
  }

  User.findByPk(id)
    .then((user) => {
      if (user != undefined) {
        res.render("admin/users/edit", { user: user });
      } else {
        res.redirect("/admin/users");
      }
    })
    .catch((erro) => {
      res.redirect("/admin/users");
    });
});

router.post("/users/update", (req, res) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((emailConfirm) => {
      if (emailConfirm === null) {
        User.create({ fullName: fullName, email: email, password: password })
          .then(() => {
            res.redirect("/admin/users");
          })
          .catch((err) => {
            // Lida com erros na criação do usuário
            console.error("Erro ao criar usuário: ", err);
            res.redirect("/admin/users/new");
          });
      } else {
        res.send(
          '<script>alert("Email já cadastrado."); window.location.href = "/admin/users/new";</script>'
        );
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar email: ", err);
      res.redirect("/admin/users/new");
    });
});

module.exports = router;
