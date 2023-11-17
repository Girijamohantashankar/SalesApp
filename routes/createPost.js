const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const Post = require("../models/Post");



router.get("/allposts", requireLogin, (req, res) => {
  Post.find()
    .select("_id salesId pname quantity amount") 
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
});

router.post("/createPost", requireLogin, (req, res) => {
  const { pname, quantity, amount } = req.body;
  // console.log(pname, quantity, amount);
  if (!pname || !quantity || !amount) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  const post = new Post({
    pname,
    quantity,
    amount,
  });
  post
    .save()
    .then((result) => {
      return res.json({ post: result });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
