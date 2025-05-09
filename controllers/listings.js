const Listing = require('../models/listing');

// module.exports is an object with index as a property.
module.exports.index = async (req,res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
}

module.exports.newForm = (req,res) => {
  res.render('listings/new.ejs');
}

module.exports.showListing = async (req,res) => {
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
}

module.exports.createListing = async (req,res) =>{
    // if(!req.body.listing) {
    //   throw new ExpressError(400,'Send valid data for listing');
    // }
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect('/listings');  
}

module.exports.editForm = async (req,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error","Listing does not exist");
    return res.redirect('/listings');
  }
  res.render('listings/edit.ejs',{listing});
}

module.exports.editListing = async (req,res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id ,{...req.body.listing});
  req.flash("success","Listing Updated");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing deleted");
  res.redirect('/listings');
}