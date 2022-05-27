const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: [validator.isURL, 'Некорректный url'],
  },
  trailerLink: {
    type: String,
    validate: [validator.isURL, 'Некорректный url'],
  },
  thumbnail: {
    type: String,
    validate: [validator.isURL, 'Некорректный url'],
  },
  owner: {
    required: true,
  },
  movieId: {
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
