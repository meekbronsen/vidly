const mongoose = require('mongoose');
const {genreSchema} = require('./genre')

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, maxlength: 255},
    genre: {type: genreSchema, required: true},
    numberInStock: {type: Number, min: 0, max: 255, default: 0 },
    dailyRentalRate: {type: Number, min: 0, max: 255, default: 0 }
})

const Movie = mongoose.model("Movie", movieSchema);

exports.Movie = Movie;
exports.movieSchema = movieSchema;