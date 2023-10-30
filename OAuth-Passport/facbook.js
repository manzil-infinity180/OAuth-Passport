const passport = require('passport');
const express=require("express");
const session = require('express-session');
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");
const app=express();

dotenv.config({path:'./config.env'});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK
},
(accessToken,refreshToken,profile,cb)=>{
  const option={
    accessToken,
    refreshToken,
    profile 
  };
  console.log(option);
  return cb(null,profile);
}
));

app.use(
  session({
    resave:false,
    saveUninitialized:true,
    secret:process.env.FACEBOOK_SECRET
  })
)
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>{
  res.send('Head over to /auth/facebook');

});
app.get('/auth/facebook',
passport.authenticate('facebook',{
  scope:['email']
})
);
// app.get('/auth/facebook',passport.authenticate('facebook',{
//   scope:['email']
// }))

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login', failureMessage: true }),
(req,res)=>{
  res.redirect('/success');
});
app.get('/success',(res,req)=>{
  res.send("successfully login!!");
})

passport.serializeUser(function (user, cb) {
  return cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
 return cb(null, obj);
});

app.get('/login',(req,res)=>{
  res.send("Go to http://localhost:3000/auth/facebook for login ")
});

app.listen(3000,()=>{
  console.log('Listening on port 3000');
})
