const express = require("express");
const auth = require("../middleware/auth");
const validateMovie = require("../middleware/validateMovies");
const { Movie } = require("../models/movie");
const { Genre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  return await Movie.find().then((result) => res.send(result));
});

router.post("/", auth, async (req, res) => {
  const { value, error } = validateMovie(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // Find the genre doc by the client's ID
  const genre = await Genre.findById(value.genreId).catch((err) =>
    res.status(404).send("Invalid Genre")
  );

  const movie = new Movie({
    title: value.title,

    // Creating the genre
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: value.numberInStock,
    dailyRentalRate: value.dailyRentalRate,
  });

  return await movie
    .save()
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send("Internal server error");
      console.log(err);
    });
});

router.put("/:id", auth, async (req, res) => {
  const { value, error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = Genre.findById(value.genreId).catch((err) =>
    res.status(400).send("Invalid Genre")
  );

  return await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: value.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: value.numberInStock,
        dailyRentalRate: value.dailyRentalRate,
      },
    },
    { new: true }
  )
    .then((result) => res.send(result))
    .catch((err) => res.send(err.message));
});

router.delete("/:id", auth, async (req, res) => {
  return await Movie.findByIdAndRemove(req.params.id, { new: true })
    .then((result) => res.send(result))
    .catch((err) => res.status(404).send("The Movie does not exist"));
});

module.exports = router;
