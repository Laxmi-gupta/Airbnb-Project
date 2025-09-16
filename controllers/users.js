const User = require('../models/user');

module.exports.signup = async (req,res) => {
   try { 
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    // register() comes from passport localMongoose it adds the pswd by hashing and salting and also checks that no 2 person have the same username like instagram
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
}

module.exports.login = async (req,res) => {
  // let {username,password} = req.body;
  req.flash("success","Welcome to wanderlust");
  // res.redirect('/listings');    we dont want to go alwasys to home page 
  res.redirect(res.locals.redirectUrl || '/listings');
}

module.exports.logout = (req,res,next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    req.flash("success","You are logout");
    res.redirect('/listings');
  })
}

module.exports.renderSignupForm = (req,res) => {
  res.render('users/signup.ejs');
}

module.exports.renderLoginForm = (req,res) => {
  res.render('users/login.ejs');
}