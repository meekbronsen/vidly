const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User} = require("../models/user");

const router = express.Router();

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(3).max(255).required(),
  });
  const result = schema.validate(user);

  return result;
}

//GET
router.get("/", async (req, res) => {
  return await User.find()
    .sort("name")
    .then((result) => res.send(result));
});

// POST
router.post("/", async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: value.email });
  
  // If user does not exist
  if (!user) {
    return res.status(400).send("This user does not exist");
  }

  const validPassword = await bcrypt.compare(value.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }

  // Generating a token
  const token = user.generateAuthToken();

  return res.send(token);
});

module.exports = router;
