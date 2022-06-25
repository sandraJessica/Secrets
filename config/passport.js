const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
const User = connection.models.User;
const validPassword = require("../lib/passwordUtils").validPassword;

//define a customFields objecto to change username and password parameter in verifyCallback function
// const customFields = {
//   usernameField: uname,
//   passwordField: pw
// }

// done represents a callback that you pass the results of your authentification to
//The “done()” function is then used to pass the “{authenticated_user}” to the serializeUser() function.
const verifyCallback = (username, password, done) => {

  User.findOne({
      username: username
    })
    .then((user) => {

      if (!user) {
        // If the user not found in DB
        // done( <no error> so null, <no matching user> so false),
        return done(null, false)
      }

      const isValid = validPassword(password, user.salt, user.hash);

      if (isValid) {
        //If user found in DB and password match,
        // done( <no error> so null, found <matching user>)
        return done(null, user);
      } else {
        // if user found but password does not match,
        // done ( <no error> so null, <no matching user> so false)
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
}

// also insert parameter customFields, if defined
const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);


// Passport will pass the authenticated_user to serializeUser as "user"
// This is the USER object from the done() in verifyCallback function
// Now attach using done (null, user.id) tie this user to the req.session.passport.user = {id: user.id},
// so that it is tied to the session object
passport.serializeUser((user, done) => {
  done(null, user.id)
});

// This is the id that is saved in req.session.passport.{ user: "id"} during the serialization
// use the id to find the user in the DB and get the user object with user details
// pass the USER object in the done() of the de-serializer
// this USER object is attached to the "req.user", and can be used anywhere in the App.
passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch(err => done(err))
});

// Passport then sets the "req.user" to the "user" returned by the deserializeUser().
// The "req.user" can now be used within the res.render("login.ejs" {name: req.user.name}, and the "login.ejs" file renders
// "Kyle has logged in"
