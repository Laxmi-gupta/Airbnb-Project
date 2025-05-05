function isLoggedIn(req,res,next) {
  // we need to check if the user is logged in then he can create listing
  // console.log(req.user);
  req.session.redirectUrl = req.originalUrl;
  if(!req.isAuthenticated()) {
    req.flash("error","You must be logged in to create new listing");
    return res.redirect('/login');
  }
  next();
  
}

saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports = {isLoggedIn,saveRedirectUrl};