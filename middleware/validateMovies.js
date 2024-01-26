const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(3).trim().required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  });
  const result = schema.validate(movie);

  return result;
};

module.exports = validateMovie;
