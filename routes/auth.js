const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Jwt_secret } = require("../keys");
const requireLogin = require("../middlewares/requireLogin.js");



router.post("/registration", (req, res) => {
  const { name, lastName, email, password } = req.body;
  if (!name || !email || !lastName || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  USER.findOne({ email: email }).then((existingUser) => {
    if (existingUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email" });
    }

    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new USER({
        name,
        lastName,
        email,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => {
          res.json({ message: "Registered successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "Internal server error" });
        });
    });
  });
});

router.post("/login", async (req, res) => {
  try {
    // console.log("Login request received:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Please add email and password" });
    }

    const savedUser = await USER.findOne({ email: email });

    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email" });
    }

    const match = await bcrypt.compare(password, savedUser.password);

    if (match) {
      const token = jwt.sign({ _id: savedUser.id }, Jwt_secret);
      const { _id, name, email, userName } = savedUser;

      return res.json({ token, user: { _id, name, email, userName } });
    } else {
      return res.status(422).json({ error: "Invalid password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
