var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var controllers = require('./backend/controllers');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'dist')));

var backendRouter = new express.Router();
// console.log(controllers.chat);
backendRouter.use('/chat', controllers.chat);

app.use('/backend', backendRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

var port = parseInt(process.env.PORT || 3000, 10);
app.listen(port, '0.0.0.0', function () {
    if (process.env.AUTO_OPEN === 'true') { // also support passing environment variable
        require('open')('http://localhost:' + port);
        process.env.AUTO_OPEN = 'false';
    }
    console.log('Example app listening on port ' + port + '!');
});
