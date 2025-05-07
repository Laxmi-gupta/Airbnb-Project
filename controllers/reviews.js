const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req,res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.review.push(newReview);

  await listing.save();  // only saves the id
  await newReview.save(); // saves the actual review doc.
  req.flash("success","New Review Created");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req,res) => {
  let {id, reviewId} = req.params; 
  // pull operator -> fetch the reviewid from lisiting id and deletes it
  await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted");
  res.redirect(`/listings/${id}`);
}