const routerMovies = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { default: validator } = require('validator');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

routerMovies.get('/movies', getMovies);

routerMovies.post(
  '/movies',
  celebrate({
    body: Joi.object()
      .keys({
        country: Joi.string().required()
          .messages({ 'string.empty': 'Страна создания фильма указана некорректно' }),
        director: Joi.string().required()
          .messages({ 'string.empty': 'Режиссер фильма указан некорректно' }),
        duration: Joi.number().required()
          .messages({ 'string.empty': 'Длительность фильма указана некорректно' }),
        year: Joi.string().required()
          .messages({ 'string.empty': 'Год выпуска фильма указан некорректно' }),
        description: Joi.string().required()
          .messages({ 'string.empty': 'Описание фильма указано некорректно' }),

        image: Joi.string().required().custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Не указана ссылка для постера к фильму');
        }),
        trailer: Joi.string().required().custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Не указана ссылка на трейлер к фильму');
        }),
        thumbnail: Joi.string().required().custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Не указана ссылка на миниатюрное изображение постера к фильму');
        }),
        movieId: Joi.number().required()
          .messages({ 'string.empty': 'некорректная длина id фильма' }),
        nameRU: Joi.string().required()
          .messages({ 'string.empty': 'Наименование фильма указано некорректно' }),
        nameEN: Joi.string().required()
          .messages({ 'string.empty': 'Наименование фильма указано некорректно' }),
      })
      .unknown(true),
  }),
  createMovie,
);

routerMovies.delete(
  '/movies/:_id',
  celebrate({
    params: Joi.object()
      .keys({
        _id: Joi.string().required()
          .messages({ 'string.empty': 'Страна создания фильма указана некорректно' }),
      })
      .unknown(true),
  }),
  deleteMovie,
);

module.exports = routerMovies;
