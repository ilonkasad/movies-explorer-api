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

const options = {
  origin: [
    'https://localhost:3000',
    'http://localhost:3000',
    'https://domainname.ilona.nomoredomains.icu',
    'http://domainname.ilona.nomoredomains.icu',
    'https://ilonkasad.github.io',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use('*', cors(options));

// const corsWhiteList = ['http://domainname.ilona.nomoredomains.icu', 'https://domainname.ilona.nomoredomains.icu'];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (corsWhiteList.indexOf(origin) !== -1) {
//       callback(null, true);
//     }
//   },
//   credentials: true,
// };
// app.use(cors(corsOptions));

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
