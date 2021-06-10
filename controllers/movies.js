const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const QueryError = require('../errors/query-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies.filter((m) => m.owner.toString() === req.user._id.toString()));
    })
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
  const { movieId } = req.params;
  Movie.findOne({ movieId, owner: req.user._id })
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Невозможно удалить фильм');
      }
      movie.remove()
        .then((mve) => {
          res.send({ data: mve });
        })
        .catch((err) => { next(err); });
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
