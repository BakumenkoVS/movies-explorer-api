const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateProfile,
  getMe,
} = require('../controllers/user');

router.get('/me', getMe);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

module.exports = router;
