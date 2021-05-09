const routerMain = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('../routes/users');
const moviesRouter = require('../routes/movies');
const authRouter = require('../routes/authorization');
const auth = require('../middlewares/auth');

routerMain.use('/', authRouter);

routerMain.use(auth);

routerMain.use('/', usersRouter);
routerMain.use('/', moviesRouter);

module.exports = routerMain;