const express = require("express");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validateGenre = require("../middleware/validateGenre");
const { Genre } = require("../models/genre");
const validateObjectID = require("../middleware/validateObjectID");

const router = express.Router();

// GET requests
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  return res.send(genres);
});

router.get("/:id", validateObjectID, async (req, res) => {
  const genres = await Genre.findById(req.params.id);
  return res.send(genres);
});

// POST requests
router.post("/", auth, async (req, res) => {
  const { error, value } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = await Genre.findOne({ name: value.name });

  // if genre already exists
  if (genre) return res.status(400).send("This genre already exists");

  genre = new Genre({
    name: value.name.toLowerCase(),
  });

  const result = await genre.save();
  return res.send(result);
});

// PUT requests
router.put("/:id", auth, (req, res) => {
  const { error, value } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: { name: value.name },
    },
    { new: true }
  )
    .then((result) => res.send(result))
    .catch((err) => res.status(404).send("The genre does not exist"));
});

// DELETE request
router.delete("/:id", [auth, admin], (req, res) => {
  return Genre.findByIdAndRemove(req.params.id)
    .then((result) => res.send(result))
    .catch((err) => res.send("Genre does not exist"));
});

module.exports = router;
