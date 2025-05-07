const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const {validateListing,isLoggedIn, isOwner} = require('../middleware.js');

const listingController = require('../controllers/listings.js');

// get all data on ui (Index route)
// wrap async we use to error handling simple way instead of using try catch
// .index ia a fn which is inside controolers bcoz functionality part remains inside it
router.get('/', wrapAsync(listingController.index));

// Aur agar tum /listings/new pe jaate ho, toh Express dono routes ko upar se neeche check karerouter.get('/listings/:id') upar likha hua hoga, toh Express "new" ko ek :id maan lega.Phir yeh hoga: Listing.findById("new") → aur tabhi error aata hai: "Cast to ObjectId failed"

//Hamesha specific/static routes (like /listings/new) ko upar rakho
//aur dynamic routes (like /listings/:id) ko baad mein likho.

// new route
router.get('/new',isLoggedIn, listingController.newForm);

// show specific only (Show route)
router.get('/:id',wrapAsync(listingController.showListing));

// to save the data in db (Create route)
router.post('/', isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// to edit the listing (Edit route)
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.editForm));

// update route
router.put('/:id',isLoggedIn,validateListing,wrapAsync(listingController.editListing));

// delete route
router.delete('/:id', isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;