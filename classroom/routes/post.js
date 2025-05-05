const express = require('express');
const router = express.Router();

// posts 

// get req posts
router.get('/',(req,res) => {
  res.send("Get posts req");
});

// show req
router.get('/:id',(req,res) => {
  res.send("show posts id");
});

// post user req
router.post('/',(req,res) => {
  res.send("post posts req");
});

// deelete user req
router.delete('/:id',(req,res) => {
  res.send("delete posts id");
});

module.exports = router;