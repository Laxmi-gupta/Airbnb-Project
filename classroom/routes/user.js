const express = require('express');
const router = express.Router();

// get req users
// router.get('/users',(req,res) => {
//   res.send("Get user req");
// });

router.get('/',(req,res) => {   // we r not writting users here becoz we hv already used it in server/js
  res.send("Get user req");
});

// show req users
router.get('/:id',(req,res) => {
  res.send("show user id");
});

// post user req
router.post('/',(req,res) => {
  res.send("post user req");
});

// deelete user req
router.delete('/:id',(req,res) => {
  res.send("delete user id");
});

module.exports = router;