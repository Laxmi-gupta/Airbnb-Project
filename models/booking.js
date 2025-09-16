const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  checkin: {
    type: Date,
    required: true
  },
  checkout: {
    type: Date,
    required: true
  },

  //User who booked (so we know who made the payment).
});

const Booking = mongoose.model("Booking",bookingSchema);

module.exports = Booking;