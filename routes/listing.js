if(process.env.NODE_ENV != 'production') {   
  // since .env contains all imp credentials so we dont use in produnction phase after deployment we dont want the user to see it
  require('dotenv').config();
}
                                                                   
const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {validateListing,isLoggedIn, isOwner} = require('../middleware.js');
const multer = require('multer');       // to upload files
const {storage} = require('../cloudConfig.js')
// const upload = multer({dest: 'uploads/'});       // stores img files indide uploads folder
const upload = multer({storage});       // stores img files indide cloudinary cloud

const listingController = require('../controllers/listings.js');
const Listing = require('../models/listing.js');

//Hamesha specific/static routes (like /listings/new) ko upar rakho
//aur dynamic routes (like /listings/:id) ko baad mein likho.

router.route('/')           // multiple routes
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

// new route
router.get('/new',isLoggedIn, listingController.newForm);

router.route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.editListing))
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// to edit the listing (Edit route)
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.editForm));

// booking get route
router.get('/:id/booking/payment',wrapAsync(listingController.showBooking));

router.post("/:id/booking/payment",wrapAsync(listingController.makePayment));

router.get("/:id/success",wrapAsync(listingController.showSuccessPayment));

router.get(":id/cancel",wrapAsync((req,res) => {
  req.flash("error","Payment cancel");
  return res.redirect('/listings');
}))

module.exports = router;