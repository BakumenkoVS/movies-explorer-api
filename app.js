const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/notFoundError');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
