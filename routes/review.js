const express = require('express');
const router = express.Router({mergeParams: true});  //this mergeparams have the url id which we r using for reviews
const {listingSchema, reviewSchema} = require('../schema.js');        // joi schema for server error handling
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {validateReview} = require('../middleware.js');

// reviews -> create route
router.post('/',validateReview,wrapAsync(async (req,res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  listing.review.push(newReview);
  await listing.save();  // only saves the id
  await newReview.save(); // saves the actual review doc.
  req.flash("success","New Review Created");
  res.redirect(`/listings/${id}`);
}));

// reviews -> delete route
router.delete('/:reviewId',wrapAsync(async (req,res) => {
  let {id, reviewId} = req.params; 
  // pull operator -> fetch the reviewid from lisiting id and deletes it
  await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;