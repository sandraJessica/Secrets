const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const isAuth = require("./authMiddleware").isAuth;
const isAdmin = require("./authMiddleware").isAdmin;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

router.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] }));

router.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect('/secrets');
  });

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });


router.get("/register", (req, res, next) => {
  res.render("register");
});


router.get("/admin-route", isAdmin, (req, res, next) => {
  // req.isAuthenticated checks if req.session.passport.user property exists and is not null
    res.send("You made it to the admin route.");
});


// successful login
router.get("/secrets", isAuth, (req, res, next) => {
  // req.isAuthenticated checks if req.session.passport.user property exists and is not null
    res.render("secrets");
});


//login failure
router.get("/login-failure", (req, res, next) => {
  res.send(`<p>You entered the wrong password. Please try again. </p>`);
});



// Visiting this route logs the user out
router.get('/logout', function(req, res, next) {
  // req.logout deletes the req.session.passport.user property from the session
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});



/**
 *---------------- Post Routes -------------------
 */


router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login-failure',
  successRedirect: '/secrets'
}), (err, req, res, next) => {
  if (err) next(err);
});



router.post("/register", (req, res, next) => {

  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
    //admin: true
  });
  newUser.save()
    .then((user) => {
      console.log(user);
    });
  res.redirect("/login");
});

module.exports = router;
