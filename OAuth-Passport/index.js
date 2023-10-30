// FACEBOOK_ID = 1662863714238839
// FACEBOOK_SECRET = 9d068476e114ec82dbbd49c5e2fe8de8
// FACEBOOK_CALLBACK = http://localhost:3000/auth/facebook/callback

const passport = require('passport');
const express=require("express");
const session = require('express-session');
const dotenv = require("dotenv");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const app=express();

dotenv.config({path:'./config.env'});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },

  /*
  ************
  Google strategy also require verify callback , which contain accessToken , refershToken(optional),
  profile( authenticated user's Google profile
  The verify callback must call *cb* providing a user to complete authentication.)
   */
  (accessToken, refreshToken, profile, done) => { // done === cb (it is callback function)
    const option={
      accessToken,
      refreshToken,
      profile 
    };
    console.log(option);

    // User is authenticated. You can save user information in your database.


    // here done is nothing but it is callback(cb)
    return done(null, profile);
  }
));
// callback  function 

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.CLIENT_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());



app.get('/',(req,res)=>{
  res.send("welcome For login - auth/google")
})

// authenticate Request

// use passport.authenticate() and specifiy the 'google' strategy to authenicate request 

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }) 
);

app.get('/auth/google/callback',

// if any failure authenication happen it directly head over to '/' 
// otherwise it will a success authenication and head over to '/profile' as specified !!!
  passport.authenticate('google', { failureRedirect: '/' }), 

  (req, res) => {
    // Successful authentication, redirect or handle as needed
    res.redirect('/profile');
  }
);

passport.serializeUser(function (user, cb) {
  return cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
 return cb(null, obj);
});

app.get('/login',(req,res)=>{
  res.send("Go to http://localhost:3000/auth/google for login ")
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


app.get('/profile', ensureAuthenticated, (req, res) => {
  // This route is protected and can only be accessed by authenticated users.
  // Add your logic here.
  res.send("Successfully login ");
});

app.listen(3000,()=>{
  console.log("running on port "+ 3000);
}
)