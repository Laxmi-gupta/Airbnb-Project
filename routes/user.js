const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controllers/users.js')

// sign up
router.get('/signup',userController.renderSignupForm);

router.post('/signup',userController.signup);

// sign in
router.get('/login',userController.renderLoginForm);

// authenticate using passport to check username,paaswd valid
// also its a middle ware so we hv passed in btw
router.post('/login',
  saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect: '/login',
    failureFlash: true,
  }),userController.login
);

// logout
router.get('/logout',userController.logout);

module.exports = router;