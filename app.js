/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');
const NotFoundError = require('./errors/not-found-err');
const usersRouter = require('./routes/users.js');
const moviesRouter = require('./routes/movies.js');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { login, createProfile } = require('./controllers/users');

const app = express();
const { PORT = 3000 } = process.env;

const options = {
  origin: [
    'https://localhost:3000',
    'http://localhost:3000',
    // 'https://domainname.student.ilona.nomoredomains.monster',
    // 'http://domainname.student.ilona.nomoredomains.monster',
    'https://ilonkasad.github.io',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('*', cors(options));

app.use(bodyParser.json());

app.use(requestLogger);


app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30)
          .messages({
            'string.min': 'Имя должно содержать больше 2 символов',
            'string.max': 'Имя должно содержать менее 30 символов',
            'string.empty': 'Не указано имя пользователя',
          }),
        email: Joi.string().required().email()
          .messages({
            'string.email': 'Некорректный адрес почты',
            'string.empty': 'Не указан адрес почты',
            'any.required': 'Адрес почты обязателен для заполнения',
          }),
        password: Joi.string().required().min(8)
          .messages({
            'string.min': 'Пароль должен содержать минимум 8 символов',
            'string.empty': 'Не указан пароль',
            'any.required': 'Пароль обязателен для заполнения',
          }),
      })
      .unknown(true),
  }),
  createProfile,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email()
          .messages({
            'string.email': 'Некорректный адрес почты',
            'string.empty': 'Не указан адрес почты',
            'any.required': 'Адрес почты обязателен для заполнения',
          }),
        password: Joi.string().required().min(8)
          .messages({
            'string.min': 'Пароль должен содержать минимум 8 символов',
            'string.empty': 'Не указан пароль',
            'any.required': 'Пароль обязателен для заполнения',
          }),
      })
      .unknown(true),
  }),
  login,
);

app.use(auth);

app.use('/', usersRouter);
app.use('/', moviesRouter);

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
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
