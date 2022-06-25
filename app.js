//jshint esversion:6
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
var passport = require("passport");
var crypto = require("crypto");
var routes = require("./routes");
const connection = require("./config/database");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
// note: requiring passport-local is not necessary
const passportLocalMongoose = require("passport-local-mongoose");
const User = connection.models.User;

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo');

// Create the Express application
const app = express();

const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

//express built-in "body-parser"
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

/**
 * -------------- SESSION SETUP ----------------
 */

//new
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_STRING,
  collectionName: "sessions"
});

// npm package express-session
app.use(session({
  // should be inside an environment variable
  secret: process.env.SECRET,
  // esave: when set to true, this will force the session to save even if nothing changed.  If you don't set this,
  //the app will still run but you will get a warning in the terminal
  resave: false,
  // saveUninitialized: Similar to resave, when set true, this forces the session to be saved even if it is unitialized
  saveUninitialized: true,
  // every new session will be saved in a MongoDB database in a "sessions" table and used to lookup sessions
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Sets an expires property that equals 1 day
  }
}));




/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */


// includes passport.use(strategy); from passport.js in app.js
require('./config/passport');

// for every HTTP request our Express app makes, it will execute both:
app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- Google OAuth2.0 ----------------
 */


 passport.use(new GoogleStrategy({
     clientID: process.env.CLIENT_ID,
     clientSecret: process.env.CLIENT_SECRET,
     callbackURL: "http://localhost:3000/auth/google/secrets"
   },
   function(accessToken, refreshToken, profile, cb) {


     User.findOrCreate({ googleId: profile.id }, function (err, user) {
       return cb(err, user);
     });
   }
 ));


 /**
  * -------------- Facebook OAuth2.0 ----------------
  */


  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/secrets"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));







/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);



/**
 * -------------- SERVER ----------------
 */


app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
