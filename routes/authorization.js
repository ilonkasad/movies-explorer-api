const routerAuth = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { login, createProfile } = require('../controllers/users');

routerAuth.post(
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

routerAuth.post(
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

module.exports = routerAuth;