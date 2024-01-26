const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const validateUser = require("../middleware/validateUser");
const auth = require("../middleware/auth");

const router = express.Router();

//GET
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.get("/", async (req, res) => {
  return await User.find()
    .sort("name")
    .then((result) => res.send(result));
});

// POST
router.post("/", async (req, res) => {
  const { error, value: data } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Find if the email already exists.
  let user = await User.findOne({ email: data.email });
  if (user) {
    return res.status(400).send("This email already exists");
  }

  // Pick key value pairs, from data.
  user = new User(_.pick(data, ["name", "email", "password"]));
  
  // Hashing the passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  // Modify data object with the hashed password.
  user.password = hashedPassword;
  const token = user.generateAuthToken();

  // For every custom header property that we define, we should prefix with x-.
  // use res.header to send response inside the head of our HTTP request
  return await user
    .save()
    .then((result) =>
      res.header("x-auth-token", token).send(_.pick(result, ["name", "email"]))
    )
    .catch((err) => {
      res.status(500).send("Internal server error");
      console.log(err);
    });
});

module.exports = router;
