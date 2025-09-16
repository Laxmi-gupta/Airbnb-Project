const express = require('express');
const router = express.Router({mergeParams: true});  //this mergeparams have the url id which we r using for reviews
const wrapAsync = require('../utils/wrapAsync.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');

// reviews -> create route
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// reviews -> delete route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;