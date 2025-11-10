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
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",     // who booked (same user model as host)
    required: true
  },

  //Payment status (to confirm only paid bookings are considered valid).
   paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  //Amount paid
   totalPrice: {
    type: Number,
    required: true
  },

  //Stripe session/payment id (to verify with Stripe later).
  stripeSessionId: {
    type: String
  }
});

const Booking = mongoose.model("Booking",bookingSchema);

module.exports = Booking;