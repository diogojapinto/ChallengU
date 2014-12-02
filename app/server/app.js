//setup=============================
var express = require('express');
//var engine = require('ejs-locals');
var app = express();
var fs = require('fs');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
//var flash = require('express-flash');
//configuration=====================
app.set("views", __dirname + '/../views');
app.set('view engine', 'ejs');
app.use("/css", express.static(path.join(__dirname, '../css')));
app.use("/images", express.static(path.join(__dirname, '../images')));
app.use("/js", express.static(path.join(__dirname, '/../js')));
app.use("/fonts", express.static(path.join(__dirname, '../fonts')));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(express.static(path.join(__dirname, '../../landing/')));
//app.use(flash());
app.use(cookieParser('shhhh, very very very secretzzzzz'));
app.use(session({
    secret           : 'shhhh, very very very secretzzzzz',
    resave           : true,
    saveUninitialized: true
}));
//routes============================
var routes = require('./routes.js')

var server = require('http').Server(app);
var io = require('socket.io')(server);
routes.listen(app, io);

//listen============================
var ipAddress = "0.0.0.0";
var port = 8081;

server.listen(port, ipAddress, function () {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

//Exports
exports = app;
