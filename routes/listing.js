const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const {validateListing,isLoggedIn, isOwner} = require('../middleware.js');

// get all data on ui (Index route)
// wrap async we use to error handling simple way instead of using try catch
router.get('/', wrapAsync(async (req,res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
}));

// Aur agar tum /listings/new pe jaate ho, toh Express dono routes ko upar se neeche check karerouter.get('/listings/:id') upar likha hua hoga, toh Express "new" ko ek :id maan lega.Phir yeh hoga: Listing.findById("new") → aur tabhi error aata hai: "Cast to ObjectId failed"

//Hamesha specific/static routes (like /listings/new) ko upar rakho
//aur dynamic routes (like /listings/:id) ko baad mein likho.

// new route
router.get('/new',isLoggedIn, (req,res) => {
  res.render('listings/new.ejs');
});

// show specific only (Show route)
router.get('/:id',wrapAsync(async (req,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id)
    //  replace object IDs (refs) in your actual documents 
    .populate({ 
      path: "review",
      populate: {
        path: "author",
      }
    })
    .populate("owner");
  if(!listing) {
    req.flash("error","Listing is deleted");
    return res.redirect('/listings');
  }
  res.render('listings/show.ejs', {listing});
}));

// to save the data in db (Create route)
router.post('/', isLoggedIn, validateListing, wrapAsync(async (req,res) =>{
    // if(!req.body.listing) {
    //   throw new ExpressError(400,'Send valid data for listing');
    // }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect('/listings');  
}));

// to edit the listing (Edit route)
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(async (req,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error","Listing does not exist");
    return res.redirect('/listings');
  }
  res.render('listings/edit.ejs',{listing});
}));

// update route
router.put('/:id',isLoggedIn,validateListing,wrapAsync(async (req,res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id ,{...req.body.listing});
  req.flash("success","Listing Updated");
  res.redirect(`/listings/${id}`);
}));

// delete route
router.delete('/:id', isLoggedIn,isOwner, wrapAsync(async (req,res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing deleted");
  res.redirect('/listings');
}));

module.exports = router;