const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");

// Require Models
const Users = require("../models/Users");

module.exports = function (passport) {
  passport.use(
    "local",
    new LocalStrategy({ usernameField: "email" }, function (
      email,
      password,
      done
    ) {
      Users.findOne({ email: email }).then(function (user) {
        if (!user) {
          return done(null, false, {
            message: "The entered email isn't registered",
          });
        } else {
          // User with such email found
          bcryptjs.compare(password, user.password, function (err, isMatch) {
            if (err) {
              console.log(err);
            }

            if (isMatch) {
              // The user's password matched successfully
              return done(null, user);
            } else {
              // Password mismatch
              return done(null, false, {
                message: "Incorrect Password",
              });
            }
          });
        }
      });
    })
  );

  passport.serializeUser(function(user, done){
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done){
    Users.findById(id).then(function(user){
        done(null, user)
    })
  })
};
