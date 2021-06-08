const routerMain = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const authRouter = require('./authorization');
const auth = require('../middlewares/auth');

routerMain.use('/', authRouter);

routerMain.use(auth);

routerMain.use('/', usersRouter);
routerMain.use('/', moviesRouter);

module.exports = routerMain;
