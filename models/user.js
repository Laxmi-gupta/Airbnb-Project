const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')  // for authentication

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

// automatically adds authentication-related fields(username,password-> salt,hash) and methods   
userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User",userSchema);

