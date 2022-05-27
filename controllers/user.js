const User = require('../models/user');
const ValidationError = require('../errors/validationError');
require('dotenv').config();

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true })
    .then((user) => res.send({ _id: user._id, name, email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports = {
  updateProfile,
  getMe,
};
