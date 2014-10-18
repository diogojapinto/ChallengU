var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

app.use("/css", express.static(__dirname + '/../css'));

app.use("/images", express.static(__dirname + '/../images'));

app.use("/js", express.static(__dirname + '/../js'));

app.use("/fonts", express.static(__dirname + '/../fonts'));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, '../html', 'landing.html'));
});

app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, '../html', 'login.html'));
});

app.get("/post-challenge", function(req, res) {
    res.sendFile(path.join(__dirname, '../html', 'challenge-submit.html'));
});


app.listen(8080, function() {
    console.log('listening on port:8080');
});



