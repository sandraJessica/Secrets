// const passport = require("passport");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = connection.models.User;
//
// require('dotenv').config();
//
// /**
//  * -------------- Google OAuth2.0 ----------------
//  */
//
// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//
//
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));
