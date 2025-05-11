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

    // fetches url from cloudinary 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if(req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      newListing.image = {url,filename};
    }
    else {
      newListing.image.url = "https://images.unsplash.com/photo-1721132447246-5d33f3008b05?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      newListing.filename = "default-img"
      
    }
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect('/listings');  
}

module.exports.editForm = async (req,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  let originalImageUrl = listing.image.url
  originalImageUrl = originalImageUrl.replace('/uploads','/uploads/h_200.w_250')
  if(!listing) {
    req.flash("error","Listing does not exist");
    return res.redirect('/listings');
  }
  res.render('listings/edit.ejs',{listing});
}

module.exports.editListing = async (req,res) => {
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});
  if(req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }
  req.flash("success","Listing Updated");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing deleted");
  res.redirect('/listings');
}