const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

// sign up
router.get('/signup',(req,res) => {
  res.render('users/signup.ejs');
});

router.post('/signup',async (req,res) => {
   try { 
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err) => {
      if(err)  {
        return next(err);
      }
      req.flash("success","New User created");
      res.redirect('/listings');
    });   
   } catch(e) {
    req.flash("error",e.message);
    res.redirect('/signup')
   }
});

// sign in
router.get('/login',(req,res) => {
  res.render('users/login.ejs');
});

// authenticate using passport to check username,paaswd valid
// also its a middle ware so we hv passed in btw
router.post('/login',
  saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect: '/login',
    failureFlash: true,
}),
async (req,res) => {
  // let {username,password} = req.body;
  req.flash("success","Welcome to wanderlust");
  // res.redirect('/listings');    we dont want to go alwasys to home page 
  res.redirect(res.locals.redirectUrl || '/listings');
});

// logout
router.get('/logout',(req,res,next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    req.flash("success","You are logout");
    res.redirect('/listings');
  })
});

module.exports = router;