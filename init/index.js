const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initdata = require('./sampledata');

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
// store mongo db data into cloud
// let dbUrl = process.env.ATLASDB_URL;


async function main() {
  // await mongoose.connect(MONGO_URL);  
  await mongoose.connect(MONGO_URL);  
}

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

// first deletes all data then insert the new ones
const initDb = async () => {
  await Listing.deleteMany();
  initdata.data = initdata.data.map((obj) => ({...obj,owner: '6815abf94792080b7d526b01'}));
  // await Listing.insertMany(initdata.data);
  console.log("data initialized");
} 

initDb(); 
