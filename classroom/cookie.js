const express = require('express');
const app = express();
const users = require('./routes/user');
const posts = require('./routes/post');
const cookieParser = require('cookie-parser');

// normal cookie
// app.use(cookieParser()) ;

// app.get('/getcookies',(req,res) => {
//   res.cookie('greet','hello');
//   res.send("send some cokkies");
// });

// app.get('/greet',(req,res) => {
//   let {name= 'anomynous'} = req.cookies;
//   res.send(name);
// });

// signed cookie
app.use(cookieParser('secretcode'));

app.get('/getsignedcookie',(req,res) => {
  res.cookie('madein','india',{signed: true});
  res.send('signed cookie');
});

app.get('/verify',(req,res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);
  res.send('verified');
});


app.get('/',(req,res) => {
  console.dir(req.cookies);
  res.send('Home root');
});

// app.use('/',users);
app.use('/users',users);      // use the common part
app.use('/posts',posts);

app.listen(3000,() => {
  console.log("Server is listening at port 3000");
});