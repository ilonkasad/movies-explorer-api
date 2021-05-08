const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const QueryError = require('../errors/query-err');
const DelError = require('../errors/del-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  let movieId = req.params.movieId;
  Movie.findOne({ movieId })
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new DelError('Невозможно удалить фильм');
      }
      Movie.findOneAndRemove(movieId)
        .then((mve) => {
          res.send({ data: mve });
        })
        .catch((err) => { next(err); })
        .catch(next);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new QueryError('Нет фильма с таким id');
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
