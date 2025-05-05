const ExpressError = require('./utils/ExpressError.js');
const Listing = require('./models/listing');
const Review = require('./models/review');
const {listingSchema,reviewSchema} = require('./schema.js');        // joi schema for server error handling

// for server error handling
const validateListing = (req,res,next) => {
  let {error} = listingSchema.validate(req.body);
  if(error) {
    const errMsg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400,errMsg);
  } else {
    next();
  }
}

const validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error) {
    const errMsg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400,errMsg);
  }
  else {
    next();
  }
}

isLoggedIn = (req,res,next) => {
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

isOwner = async(req,res,next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  // only the own we can edit 
  if(!listing.owner.equals(res.locals.user._id)) {
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

isReviewAuthor = async (req,res,next) => {
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.user._id)) {
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports = {validateListing,validateReview,isLoggedIn,saveRedirectUrl,isOwner,isReviewAuthor};