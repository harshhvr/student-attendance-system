// index router

const express = require("express");
const router = express.Router();
const indexController = require("../src/controllers/indexController");

//
// GET Requests

router.get("/", (req, res, next) => {
  res.redirect("/home");
});

router.get("/home", indexController.viewHomepage);
router.get(
  "/signin",
  indexController.checkSignOut,
  indexController.viewSignInForm
);
router.get("/signout", indexController.signout);

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//
// POST Requests

router.post("/signin", indexController.signin);

module.exports = router;
