//setup=============================
var express = require('express');
var app = express();
var fs = require('fs');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
//configuration=====================
app.use("/css", express.static(__dirname + '/../css'));
app.use("/images", express.static(__dirname + '/../images'));
app.use("/js", express.static(__dirname + '/../js'));
app.use("/fonts", express.static(__dirname + '/../fonts'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(express.static(path.join(__dirname, '../../landing/')));
app.use(cookieParser('shhhh, very very very secretzzzzz'));
app.use(session({
    secret: 'shhhh, very very very secretzzzzz',
    resave: true,
    saveUninitialized: true
}));
//routes============================
var routes = require('./routes.js')
routes.start(app);

//listen============================
var ipAddress = "127.0.0.1";
var port = 8080;
app.listen(port, ipAddress, function(){
  console.log((new Date()) + ' Server is listening on port ' + port);
});

//Exports
exports = app;
