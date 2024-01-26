const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");

const router = require("express").Router();

router.post("/", auth, async (req, res) => {
  const { customerId, movieId } = req.body;

  if (!customerId) return res.status(400).send("customer id not provided");
  if (!movieId) return res.status(400).send("movie id not provided");

  const rental = await Rental.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });

  if (!rental) return res.status(404).send("rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Movie is already returned");

  const dateReturned = new Date();

  const rentTime = rental.dateOut.getTime();
  const returnTime = rental.dateReturned.getTime();

  const days = Math.round((returnTime - rentTime) / (24 * 60 * 60 * 1000));

  const rentalFee = days * rental.movie.dailyRentalRate;

  rental.set({
    dateReturned: dateReturned,
    rentalFee: rentalFee,
  });

  const result = await rental.save();

  return res.status(200).send(result);
});

module.exports = router;


