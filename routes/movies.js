const routerMovies = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
        image: Joi.string().pattern(new RegExp(/(http|https):\/\/(www\.)?(\S+)\.([a-zA-Z])+(\/)?(\w-\._~:\/\?#\[\]@!\$&’\(\)\*\+,;=)?/))
          .messages({
            'string.empty': 'Не указана ссылка для постера к фильму',
          }),
        trailer: Joi.string().pattern(new RegExp(/(http|https):\/\/(www\.)?(\S+)\.([a-zA-Z])+(\/)?(\w-\._~:\/\?#\[\]@!\$&’\(\)\*\+,;=)?/))
          .messages({
            'string.empty': 'Не указана ссылка на трейлер к фильму',
          }),
        thumbnail: Joi.string().pattern(new RegExp(/(http|https):\/\/(www\.)?(\S+)\.([a-zA-Z])+(\/)?(\w-\._~:\/\?#\[\]@!\$&’\(\)\*\+,;=)?/))
          .messages({
            'string.empty': 'Не указана ссылка на трейлер к фильму',
          }),
        movieId: Joi.string().required()
          .messages({ 'string.empty': 'некорректная длина id фильма' }),
        nameRU: Joi.string().required()
          .messages({ 'string.empty': 'Страна создания фильма указана некорректно' }),
        nameEN: Joi.string().required()
          .messages({ 'string.empty': 'Страна создания фильма указана некорректно' }),
      })
      .unknown(true),
  }),
  createMovie,
);

routerMovies.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object()
      .keys({
        movieId: Joi.string().required()
          .messages({ 'string.empty': 'Страна создания фильма указана некорректно' }),
      })
      .unknown(true),
  }),
  deleteMovie,
);

module.exports = routerMovies;
