// to read .env file values -> use dotenv module which is required
if(process.env.NODE_ENV != 'production') {   // since .env contains all imp credentials so we dont use in produnction phase after deployment we dont want the user to see it
  require('dotenv').config();
}
                                                                   
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const {validateListing,isLoggedIn, isOwner} = require('../middleware.js');
const multer = require('multer');       // to upload files
const {storage} = require('../cloudConfig.js')
// const upload = multer({dest: 'uploads/'});       // stores img files indide uploads folder
const upload = multer({storage});       // stores img files indide cloudinary cloud

const listingController = require('../controllers/listings.js');

// get all data on ui (Index route)
// wrap async we use to error handling simple way instead of using try catch
// .index ia a fn which is inside controolers bcoz functionality part remains inside it
// router.get('/', wrapAsync(listingController.index));

// Aur agar tum /listings/new pe jaate ho, toh Express dono routes ko upar se neeche check karerouter.get('/listings/:id') upar likha hua hoga, toh Express "new" ko ek :id maan lega.Phir yeh hoga: Listing.findById("new") → aur tabhi error aata hai: "Cast to ObjectId failed"

//Hamesha specific/static routes (like /listings/new) ko upar rakho
//aur dynamic routes (like /listings/:id) ko baad mein likho.

router.route('/')
  .get(wrapAsync(listingController.index))
  // for new route we hv use enctype(send file to backend) 
  //req.body -> dont return anything bcoz enctype ->we need to parse it for readble form by using multer-> req.file
  .post(isLoggedIn, validateListing,upload.single('listing[image]'), wrapAsync(listingController.createListing));

// new route
router.get('/new',isLoggedIn, listingController.newForm);

// to save the data in db (Create route)
// router.post('/', isLoggedIn, validateListing, wrapAsync(listingController.createListing));

router.route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.editListing))
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// to edit the listing (Edit route)
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.editForm));

// update route
// router.put('/:id',isLoggedIn,validateListing,wrapAsync(listingController.editListing));    storing the same path inside single route

// show specific only (Show route)
// router.get('/:id',wrapAsync(listingController.showListing));

// delete route
// router.delete('/:id', isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;