const express = require('express');
const app = express();
const expressSession = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const session = require('express-session');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(
  session({
    secret: 'mysecretscode',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.get('/register',(req,res) => {
  let {name='anomynous'} = req.query;
  req.session.name = name; 
   console.log(req.session);
  // req.flash("success","User registered successfully");
  // res.redirect('/hello');
});

app.get('/hello',(req,res) => {
  // res.render('page.ejs',{name: req.session.name, msg: req.flash("success")});

  res.locals.messages = req.flash("success");
  res.render('page.ejs',{name: req.session.name});
});

// app.get('/reqCount',(req,res) => {
//   if(req.session.count) req.session.count++;
//   else req.session.count = 1;
//   res.send(`request send ${req.session.count} times`);
// })

app.get('/',(req,res) => {
  res.send('test successful');
});

app.listen(3000,() => {
  console.log("Server is listening at port 3000");
});