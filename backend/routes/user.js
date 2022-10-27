const express = require("express");
const bcrypt = require("bcrypt");
const jesonWebToken = require("jsonwebtoken");

const User = require("../models/user");
const user = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User Created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid Authentication Credentials!",
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Please Check Your Credentials!",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Please Check Your Credentials!",
        });
      }
      const token = jesonWebToken.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
        },
        "4wheelsmovethebody2wheelsmovethesoul",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        message: "Authentication Success!",
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Please Check Your Credentials!",
      });
    });
});

module.exports = router;
