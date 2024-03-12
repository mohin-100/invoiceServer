const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./token");
const loginRoutes = express.Router();

let User = require("../models/User");

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Handle the error appropriately
});

loginRoutes.route("/").post( async function (req, res) {
  try {
    const { email, password } = req.body;

    console.log(req.body, await User.findOne({ email }));
    // Find the user by email
    const user = await User?.findOne({ email });

    console.log(email, password, user?.password);
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ status: 500, mssg: "Invalid credentials" });
    }

    // Check if user.password is a non-empty string
    if (typeof user?.password !== "string" || user?.password?.length === 0) {
      return res.status(401).json({ status: 500, mssg: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, user?.password);

    if (isValidPassword) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, "your-secret-key", {
        expiresIn: "1h",
      });

      res.status(200).json({ status: 200, token });
    } else {
      res.status(401).json({ status: 500, mssg: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, mssg: "Internal server error" });
  }
});


module.exports = loginRoutes;
