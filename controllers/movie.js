const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const ForbiddenError = require('../errors/forbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Такой фильм не существует'));
      }
      return res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Такой карточки не существует'));
      }
      if (!(movie.owner.toString() === req.user._id)) {
        throw new ForbiddenError('У вас нет прав для удаления этого фильма');
      }
      return Movie.findByIdAndRemove(req.params.id).then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Введен некорректный id карточки'));
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovie,
};
