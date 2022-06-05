const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/notFoundError');

const auth = require('./middlewares/auth');
const { errorLogger, requestLogger } = require('./middlewares/logger');

require('dotenv').config();

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'http://localhost:3000/',
  'https://mesto.bakumenko.nomoredomains.xyz',
  'http://mesto.bakumenko.nomoredomains.xyz',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

app.use(require('./routes/login'));

app.use(require('./routes/login'));

app.use(auth);

app.use(require('./routes/user'));
app.use(require('./routes/movie'));

app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  next(
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    }),
  );
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
