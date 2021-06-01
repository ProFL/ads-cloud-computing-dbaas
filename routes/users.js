var express = require("express");
var router = express.Router();

const db = require("../firebase/firestore");

router.post("/", function (req, res, next) {
  const data = req.body;

  const ref = db.collection("users").doc();
  ref
    .set(data)
    .then((v) => {
      console.dir(v);
      res.redirect('/');
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/", function (req, res, next) {
  db.collection("users")
    .get()
    .then((usersRef) => {
      const users = [];
      usersRef.forEach((ur) => {
        users.push({ id: ur.id, ...ur.data() });
      });
      res.render("users", { users });
    })
    .catch(next);
});

module.exports = router;
