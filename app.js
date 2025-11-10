if(process.env.NODE_ENV != 'production') {
  require('dotenv').config(); 
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const method_override = require('method-override');
const ejs_mate = require('ejs-mate');
const session = require('express-session');     // to store user relate data
const MongoStore = require('connect-mongo'); // stores session related data
const flash = require('connect-flash');          // to display messages like toaster
const passport = require('passport');             // authentication
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');          // user schema is defined   
const listingRouter = require('./routes/listing.js');     // express router simplifying app.js in shorter difn files
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlustNew";

main()
  .then(() => console.log("Connection succesfull"))
  .catch((err) => console.log("Connection error",err)); 

async function main() {
  await mongoose.connect(MONGO_URL);
};

// for ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
// access the form values like (req.body)
app.use(express.urlencoded({extended: true}));
// override
app.use(method_override("_method"));
// ejs-mate
app.engine('ejs',ejs_mate);  
// for css public folder
app.use(express.static(path.join(__dirname,'public')));

// this stores the session in mongo
const store = MongoStore.create({
  // mongoUrl: dbUrl,
  mongoUrl: MONGO_URL,
  crypto: { 
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

// to show error in console
store.on('error',(err) => {
  console.log("Error in mongo session store",err);
});

// for express session 
let sessionOptions = {
  store,                      // tells express-session to use MongoDB instead of memory
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true 
  }
}

app.use(session(sessionOptions));  // this creates a session id and stored inside cookie so user can been logged in in muiltiple pages 
// for flash messsage
app.use(flash());        // we can use flash after opening session before that we cant use it

// to use pasport first we need to initialize it
app.use(passport.initialize());
app.use(passport.session());            // to add sesions in it
//  Tell passport to use LocalStrategy and authenticate using User model
passport.use(new LocalStrategy(User.authenticate()));  
passport.serializeUser(User.serializeUser());   // Save user ID in session
passport.deserializeUser(User.deserializeUser());   //	Fetch user from DB using that ID

// the flash msg we hv stored in session which is coming from create route and that is redirecting to index page 
app.use((req,res,next) => {
  res.locals.success = req.flash("success");     // res.locals we use to fetch flash msg directly in ejs file
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// bcoz after deployng its redirect to / we dont need that  
app.get('/', (req, res) => {
  res.redirect('/listings');
});

// from these our all listing routes are combingin from routes/ lisiting.js
app.use('/listings',listingRouter);

// from these our all review routes are combingin from routes/ review.js
app.use('/listings/:id/reviews',reviewRouter);

app.use('/',userRouter);    // to use the get post routes

app.get('/flights',(req,res) => {
  res.render('./flights/home.ejs');
})

app.use((err,req,res,next) => {
  let {status = 500,message = "Something error occured"} = err;
  res.status(status).render("error.ejs",{message});
});

app.listen(8080, () => {
  console.log('Server is listenig to port 8080');
});
