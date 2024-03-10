const express = require("express");
const app = express();
const userRoutes = express.Router();
const bcrypt = require("bcrypt");
const verifyToken = require("./token");

let User = require("../models/User");

userRoutes.route("/add").post(verifyToken, async function (req, res) {
  const { name, email, password, phone_number, picture } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // If the email is already taken, send an error response
    return res.status(409).json({ status: 500, mssg: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword, // Store the hashed password
    phone_number,
    picture,
  });

  // let user = new User(req.body);
  user
    .save()
    .then((user) => {
      res
        .status(200)
        .json({
          status: 200,
          mssg: "user added successfully",
          userDetails: user,
        });
    })
    .catch((err) => {
      res.status(409).send({ status: 500, mssg: "unable to save to database" });
    });
});

// api to get users
userRoutes.route("/").get(verifyToken, function (req, res) {
  User.find(function (err, users) {
    if (err) {
      res.status(400).send({ status: 500, mssg: "Something went wrong" });
    } else {
      res.status(200).json({ status: 200, users: users });
    }
  });
});

// api to edit user
userRoutes.route("/edit/:id").get(verifyToken, function (req, res) {
  let id = req.params.id;
  User.findById(id, function (err, user) {
    if (err) {
      res.status(400).send({ status: 500, mssg: "Something went wrong" });
    } else {
      res.status(200).json({ status: 200, user: user });
    }
  });
});

// api to update route
userRoutes.route("/update/:id").post(verifyToken, function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (!user) {
      res.status(400).send({ status: 500, mssg: "Unable to find data" });
    } else {
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user.phone_number = req.body.phone_number;

      user.save().then((business) => {
        res.status(200).json({ status: 200, mssg: "Update complete" });
      });
    }
  });
});

// api for delete
userRoutes.route("/delete/:id").get(verifyToken, function (req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function (err) {
    if (err) {
      res.status(400).send({ status: 500, mssg: "Something went wrong" });
    } else {
      res.status(200).json({ status: 200, mssg: "Delete successfully" });
    }
  });
});

module.exports = userRoutes;
