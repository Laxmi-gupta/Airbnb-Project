if(process.env.NODE_ENV != 'production') {
  require('dotenv').config(); 
}

const Listing = require('../models/listing');
const Booking = require('../models/booking');
const { geocoding,config } = require('@maptiler/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
config.apiKey = process.env.MAP_API_KEY;

// module.exports is an object with index as a property.
module.exports.index = async (req,res) => {
  const { searchDestination, checkIn, checkOut } = req.query;
  let allListings;

  // Step 1️⃣: Base filter (country/location)
  const query = {};
  if(searchDestination) {
    // allListings = await Listing.find({
       query.$or =  [{
        country: {$regex: searchDestination, $options: "i"}},
        {
          location: {$regex: searchDestination, $options: "i"}
        }]
     // });
  } 

  // Step 2️⃣: Get all listings matching city/location
  allListings = await Listing.find(query);

  // Step 3️⃣: If user selected check-in and check-out
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Step 4️⃣: Find bookings that overlap
    const bookedListings = await Booking.find({
      $and: [
        {
          checkin: { $lt: checkOutDate },
          checkout: { $gt: checkInDate },
        },
      ],
    }).select("listing");

    // Step 5️⃣: Get booked listing IDs
    const bookedListingIds = bookedListings.map(b => b.listing.toString());

    // Step 6️⃣: Filter out booked listings
    allListings = allListings.filter(
      l => !bookedListingIds.includes(l._id.toString())
    );
  }

   if (allListings.length === 0) {
    req.flash("error", "No listings available for the selected dates or location.");
    return res.redirect("/listings");
  }

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

  // since previous listing do not hv geometry so we hv put condition if geometry is not defined only for that store in db else dont store
  if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0) {
    // for geocoding converting loc to coords and storing in db
    let response = await geocoding.forward(listing.location,{limit: 1});
    // this will store cordinated in db
    listing.geometry = response.features[0].geometry;
    await listing.save();
  }

  // for disabling booked dates
  let bookedListing = await Booking.find({listing: id});
  let disableDates = bookedListing.map((booking) => ({
    from: booking.checkin.toISOString().split("T")[0],
    to: booking.checkout.toISOString().split("T")[0]
  }));
  res.render('listings/show.ejs', {listing, disableDates});
}

module.exports.createListing = async (req,res) =>{
    // for geocoding converting loc to coords and storing in db
    let response = await geocoding.forward(req.body.listing.location,{limit: 1});
    // fetches url from cloudinary 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    // this will store cordinated in db
    newListing.geometry = response.features[0].geometry;
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

module.exports.showBooking = async(req,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  let {checkin,checkout} = req.query;

  let book = new Booking({
    listing: id,
    checkin,
    checkout,
  })
  // await book.save();
  res.render("listings/booking.ejs", {checkin,checkout,listing});
}

module.exports.makePayment = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id); 
    const { checkin, checkout,cardno,expiry,cvv} = req.body;
    let user = res.locals.user;
    const nights = (new Date(checkout) - new Date(checkin))/(1000*60*60*24);
    const totalPrice = nights * listing.price;
    
    // make payment through stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {name: listing.title},
          unit_amount: totalPrice * 100
          },
          quantity: 1,
      }],
      success_url: `${process.env.DOMAIN}/listings/${id}/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.DOMAIN}/listings/${id}/cancel`
    })
    //console.log(session);

    const booking = new Booking({
      listing: id,
      checkin,
      checkout,
      user: user._id,
      totalPrice,
      stripeSessionId: session.id
    })

    await booking.save();

    return res.redirect(session.url);
}

module.exports.showSuccessPayment = async(req,res) => {
  const {session_id} = req.query;

  if(!session_id) {
    req.flash("error","Invalid payment");
    return res.redirect('/listings');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  const booking = await Booking.findOne({stripeSessionId: session_id});
  if(!booking) {
    req.flash("error", "Booking not found");
    return res.redirect('/listings');
  }

  if(session.payment_status === 'paid') {
    booking.paymentStatus = 'paid';
    await booking.save();

    req.flash("success","Payment Successful!! Booking Confirmed");
  } else {
    req.flash("error","Payment not completed");

  }
  return res.redirect("/listings")
}