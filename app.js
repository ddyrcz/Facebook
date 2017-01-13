var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('config');

var auth = require('./route/auth');
var user =  require('./route/user');
var post =  require('./route/post');

var app = express();

mongoose.connect(config.get('connection'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


if (process.env.NODE_ENV == 'development') {
    app.use(logger('dev'));
}

app.use(auth);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', user);
app.use('/posts', post);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({        
        message: err.message,
        error: {}
    });
});


module.exports = app;
