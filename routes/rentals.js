const express = require("express");
const mongoose = require("mongoose");
const { Rental } = require("../models/rental");
const validateRental = require("../middleware/validateRental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const router = express.Router();


// GET
router.get("/", async (req, res) => {
  return await Rental.find()
    .sort("-dateOut")
    .then((result) => res.send(result));
});

// POST
router.post("/", async (req, res) => {
  const { error, value } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(value.customerId).catch(() =>
    res.status(400).send("Invalid customer")
  );

  const movie = await Movie.findById(value.movieId).catch(() =>
    res.status(400).send("Invalid Movie")
  );

  if (movie.numberInStock === 0) {
    return res.status(400).send("Movie out of stock");
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // Transaction to reduce the number in stock
  const session = await mongoose.startSession();
  
  await session.withTransaction( async () => {
    const result = await rental.save();

    // Get the movie document and reduce numberInStock and save.
    movie.numberInStock-- ;
    movie.save();

    // Respond to client with result.
    res.send(result); 
  })

  // Terminate Session
  session.endSession();

});

module.exports = router;
