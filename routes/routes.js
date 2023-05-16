const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport')

// Require Models
const Users = require("../models/Users");
const Notes = require("../models/Notes");


// Description      Renders Login Screen
router.get("/", function (req, res) {
  res.render("./auth/Login");
});

// Description  Handle login functionality
router.post('/', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true
  })(req, res, next)
})

// Description      Renders Signup Screen
router.get("/signup", function (req, res) {
  res.render("./auth/Signup");
});

// Description  Handle Signup functionality
router.post("/signup", function (req, res) {
  let errors = [];
  if (req.body.password !== req.body.confirmpassword) {
    errors.push({ msg: "Password mismatch" });
    res.render("./auth/Signup", {
      errors,
    });
  } else if (req.body.password.length <= 5) {
    errors.push({ msg: "Your password should be more than 5 characters" });
    res.render("./auth/Signup", {
      errors,
    });
  } else {
    // Check to see if user already exists or not
    Users.findOne({ email: req.body.email }).then(function (user) {
      if (user) {
        // User already exists
        errors.push({
          msg: `The email, ${req.body.email}, has been registered already`,
        });
        res.render("./auth/Signup", {
          errors,
        });
      } else {
        // No user with that email yet. So start creating the user
        const newUser = new Users({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        });

        //Encrypt password
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) {
              errors.push({ msg: "An error occured" });
            } else {
              newUser.password = hash;

              newUser.save().then(function (user) {
                res.redirect("/");
              });
            }
          });
        });
      }
    });
  }
});

// Description  Render Dashboard
router.get("/dashboard", function (req, res) {
  res.render("./dashboard/Dashboard");
});

// Description  Render Add Notes Page
router.get("/add-note", function (req, res) {
  res.render("./dashboard/Addnote");
});

router.post('/add-note', function(req, res){
  const newNote = new Notes({
    title: req.body.title,
    note: req.body.note,
    author: req.user.email
  })
  newNote.save().then(function(success){
    req.flash("success_message", "Note added successfully")
    res.redirect('/all-notes')
  })
})

// Description  Render All Notes Page
router.get("/all-notes", function (req, res) {
  Notes.find({author: req.user.email}).then(function(notes){
    res.render("./dashboard/Allnotes", {
      notes: notes
    });
  })      
});

// Profile
router.get("/profile", function (req, res) {
  res.render("./dashboard/Profile.ejs");
});

// Signout
router.get("/signout", function (req, res) {
  res.redirect("/");
});

module.exports = router;
