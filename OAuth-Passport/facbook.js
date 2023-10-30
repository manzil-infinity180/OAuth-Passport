const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const port = 5000;
const express = require('express');
const session = require("express-session");
const app = express();


passport.use(new FacebookStrategy({
  clientId: 1662863714238839,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK
},
(accessToken,refreshToken,profile,cb)=>{
  return cb(null,profile);
}

));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.FACBOOK_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/',(req,res)=>{
  res.send("Login with Facebook - auth/facebook");
})
app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/login/facebook', passport.authenticate('facebook', {
  scope: [ 'email', 'user_location' ]
}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
  });

  app.listen(port,()=>{
    console.log("listening on port 5000");
  })

