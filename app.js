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
// note: requiring passport-local is not necessary
const passportLocalMongoose = require("passport-local-mongoose");

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo');

// Create the Express application
const app = express();

const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

//express built-in "body-parser"
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * -------------- SESSION SETUP ----------------
 */

//new
const sessionStore = MongoStore.create({mongoUrl: process.env.DB_STRING, collectionName: "sessions"});

// npm package express-session
app.use(session({
  // should be inside an environment variable
  secret: process.env.SECRET,
  // options resave and saveUninitialized treat how session reacts when there are no changes in the browser
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Sets an expires property that equals 1 day
  }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

 // Need to require the entire Passport config module so app.js knows about it
 require('./config/passport');




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
