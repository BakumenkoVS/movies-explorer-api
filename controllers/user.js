const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validationError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/unauthorizedError');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

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

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new ValidationError('Некорректные данные пароля или почты');
  }
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким EMAIL уже зарегистрирован'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные id пользователя'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ValidationError('Некорректные данные пароля или почты');
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Доступ запрещен'));
    });
};

module.exports = {
  updateProfile,
  getMe,
  login,
  createUser,
};
