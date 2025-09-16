# Routes

## Use app.get("/path", handler)  -> when you have to registers a single GET route.
## Use app.use("/path", router) -> when u need to mounts an entire router module under a base path. That router can contain many routes (GET, POST, PUT, DELETE…).

# listing router

## req.body 
used when you want to store new data (like creating a new listing, saving a booking, or updating a profile).

## req.query
used for search/filtering information, not new data to store.
The search criteria should be part of the URL, so users can share/bookmark it.

## why to use router instead of app
Router allows you to split routes into separate files/modules (listing, review, auth) for better organization.
## Use router.route(path) → when you have multiple HTTP methods on the same path.
## Use router.get/post/put → when you only need one method.

## wrapAsync
It takes a function (fn) that is async (like your route handler).
It returns a new function (req, res, next) that runs your handler and attaches .catch(next).
That way, any error goes automatically to Express’s error-handling middleware app.use(err,req,res,next) instead of crashing.

If fn (your async route handler) throws an error,
.catch(next) calls next(err) like this shorthand fn(req, res, next).catch(err => next(err));
Express sees next(err) and jumps to the error-handling middleware (either your custom one or its built-in one).

## isLoggedIn
If user is not logged in → We save the URL they originally wanted (req.originalUrl) into session. Show an error message. Redirect them to /login.
After login, app checks req.session.redirectUrl. If it exists → redirect them back to /listings/new (the exact page they wanted).

## validate listing
You use this function to protect your application. It ensures that only clean, valid, and correctly formatted data ever gets processed and saved. Without it, your application might try to save garbage data, which could cause crashes, strange bugs, or security vulnerabilities.

## What is Multer?
Multer is a middleware for Express.js.
It is used to handle file uploads (like images, PDFs, etc.) sent through an HTML form.
Normal req.body only handles text (strings, numbers).
But when you upload a file, the form uses enctype="multipart/form-data". Express can’t read that on its own.
👉 That’s where Multer comes in — it parses the uploaded file(s) and makes them available in req.file (for single) or req.files (for multiple).

to use multer we need to add this in form -> 
## enctype="multipart/form-data" -> by this we can upload file, image also
The default encoding can only handle text data. File contents get corrupted or lost because they can't be properly encoded as simple name-value pairs.
Without it (Default: application/x-www-form-urlencoded)
enctype="multipart/form-data" tells the browser how to format the form data before sending it to the server.
upload.single(image file) -> to upload single file

## review router

{mergeParams: true} 
app.use('/listings/:id/reviews', reviewRouter); The :id belongs to the parent route (/listings/:id/reviews). (app)
If you want your child router to also access parameters from the parent route, you must enable mergeParams: true.
i.e in the review route

## when to use throw keyword and when to send to error handling middleware

Since validateReview is synchronous (only schema validation, no DB calls), using throw is clean and perfectly fine (throw new ExpressError(400,errMsg);).
If tomorrow you make it async (e.g., checking something in DB before validating), then switch to next(err) or wrap it in wrapAsync.

## usercontroller

## User.register()?
This comes from passport-local-mongoose (the library you are using for authentication).
Hash the password securely with bcrypt.
Store hash + salt inside MongoDB.
Save the new user document.
Return the saved user (that’s why you store it in registeredUser).
So you don’t directly save password in Mongo — it’s always stored as a hash 🔐.

## req.login(registeredUser) → tell Passport: “log this user in and create a session.”

## post -> SaveRedirectUrl
If user was redirected to login because they tried a protected page, this middleware saves that original URL (req.session.redirectUrl → res.locals.redirectUrl) so we can redirect them back after successful login.

## passport.authenticate("local") 
checks credentials.
If wrong → redirect /login + flash error.
If correct → log user in → go to next step.


## for cookies, session and authentication usiing passport refer notion -> https://www.notion.so/Cookies-and-Sessions-26657e383a04809b8d7ddb0247db12c3?source=copy_link