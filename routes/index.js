const router = require("express").Router();
const passport = require("passport");
const passwordUtils = require("../lib/passwordUtils");
const connection = require("../config/database");
const User = connection.models.User;

/**
*---------------- Routes -------------------
*/



/**
*---------------- Get Routes -------------------
*/


router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/secrets", (req, res, next) => {


});





/**
*---------------- Post Routes -------------------
*/

router.post("/login", (req, res, next) => {


});

router.post("/register", (req, res, next) => {


});

module.exports = router;
