const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');

require("dotenv").config();

/**
 *---------------- DATABASE -------------------
 */

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Mongoose Schema for User
const userSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  googleId: String,
  facebookId: String
  //admin: Boolean
});

userSchema.plugin(findOrCreate);

// mongoose Model
const User = connection.model("User", userSchema);


//export the connection
module.exports = connection;
