const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  try {
    if (!authorization) {
      throw new AuthError('Необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      throw new AuthError('Необходима авторизация');
    }
  } catch (err) { next(err); }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
