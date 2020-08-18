var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var auth = require('./middlewares/auth')
var mongoose = require('mongoose')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// connecting to mongoDB
const url = 'mongodb://127.0.0.1:27017/confusion'



mongoose.connect(url)
  .then(db => {
      console.log('successfully connect to server')
  })





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("somebodythatiusedtoknow"))
app.use(session({
  name: "session-id",
  store: new FileStore(),
  cookie: { secure: false },
  secret: "somebodythatiusedtoknow",
  saveUninitialized: false,
  resave: false
}))
app.use(auth)

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', require('./routes/dishesRouter'))
app.use('/promotions', require('./routes/promotionsRouter'))
app.use('/leaders', require('./routes/leadersRouter'))

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
  res.render('error');
});

module.exports = app;
