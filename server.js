const express = require('express')
const app = new express()
const path = require('path')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const session = require('express-session')

// Connect MongoDB
const db = require('./config/db').MONGO_URI
// Require customized passport code
require('./config/passport')(passport)

mongoose.connect(db).then(function(){
    console.log('MongoDB Connected')
}).catch(function(error){
    console.log('MongoDB not connected....')
})

// Set view engine
app.set('view engine', 'ejs')

// Serve Static contents
app.use(express.static(path.join(__dirname, "public")))

// Accept data from forms
app.use(express.urlencoded({extended: false}))

// Use Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect Flash Middleware
app.use(flash())

// Declare GLobal Variables
app.use(function(req, res, next){
    res.locals.success_message = req.flash("success_message");
    res.locals.error_message = req.flash("error_message");
    res.locals.error = req.flash("error");
    next()
})



// Require Routes
const routes = require('./routes/routes')

app.use('/', routes)

// Create server
const PORT = process.env.PORT || 4500
app.listen(PORT, function(){
    console.log(`Server running on PORT ${PORT}`)
})