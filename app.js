/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./rate-limit');
const NotFoundError = require('./errors/not-found-err');
const mainRouter = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000 } = process.env;
// const mongoUrl = process.env.NODE_ENV === 'production' ? process.env.MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb';
const mongoUrl = 'mongodb://localhost:27017/bitfilmsdb';
const corsOptions = {
  // домены у которые могут общаться с сервером
  origin: [
    'http://localhost:3000',
    'http://domainname.ilona.nomoredomains.icu',
    'https://domainname.ilona.nomoredomains.icu',
  ],
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['origin'],
  credentials: true, // если нужно отправлять куки
};

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(cors(corsOptions));

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

// app.use(cors({ origin: ['https://domainname.ilona.nomoredomains.icu', 'http://domainname.ilona.nomoredomains.icu'], credentials: true }));

app.use(bodyParser.json());

app.use('/', mainRouter);

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
