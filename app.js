require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const nunjucks = require('nunjucks');
const fileUpload = require('express-fileupload');

const destinationsRouter = require('./controllers/destinations');
const destinationsApiRouter = require('./controllers/destinations.api');
const usersApiRouter = require('./controllers/users.api');
// const usersRouter = require('./controllers/users');

var app = express();

// view engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
});
app.set('view engine', 'njk');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload({
  createParentPath: true
}));

app.use('/destinations', destinationsRouter);
app.use('/api/v1/destinations', destinationsApiRouter);
app.use('/api/v1/users', usersApiRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status == 404) {
    res.send('404');
  } else {
    res.render('error');
  }
});

module.exports = app;
