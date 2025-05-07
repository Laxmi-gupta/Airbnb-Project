const express = require('express');
const router = express.Router({mergeParams: true});  //this mergeparams have the url id which we r using for reviews
const {listingSchema, reviewSchema} = require('../schema.js');        // joi schema for server error handling
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');

const reviewController = require('../controllers/reviews.js');

// reviews -> create route
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// reviews -> delete route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;