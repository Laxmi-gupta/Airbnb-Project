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
      filename: String,
      url: String,
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