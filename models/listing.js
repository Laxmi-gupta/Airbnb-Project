const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

  const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      // bcoz the cloudinary genrates link while sending tha img and that we store it in mongo db
      filename: String,
      url: String,
      // default: "https://images.unsplash.com/photo-1721132447246-5d33f3008b05?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      // set: (v) => v === "" ? "https://images.unsplash.com/photo-1721132447246-5d33f3008b05?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: Number,
    location: String,
    country: String,
    review: [{
      type: Schema.Types.ObjectId,
      ref: "Review"
    }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    geometry: {
      type: {
        type:String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  });

// we want if we delete the listing then all the reviews of it shld also be deleted from review array
// the delete route of lisitng -> uses findByIdanddelete when that triggers it comes to this 
listingSchema.post("findOneAndDelete",async(listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.review} })
  }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;