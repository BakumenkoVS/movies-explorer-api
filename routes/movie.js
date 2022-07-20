const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getMovies,
  createMovies,
  deleteMovie,
} = require("../controllers/movie");

const regularEmail =
  /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;
router.get("/movies", getMovies);

router.post(
  "/movies",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(regularEmail),
      trailerLink: Joi.string().required().pattern(regularEmail),
      thumbnail: Joi.string().required().pattern(regularEmail),
      movieId: Joi.number(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovies
);

router.delete(
  "/movies/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).required(),
    }),
  }),
  deleteMovie
);

module.exports = router;
