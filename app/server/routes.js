var path = require('path');
var db = require('./database-setup');
exports.start = function (app) {

//entry point
    app.get('*', function (req, res) {
        res.sendfile(path.join(__dirname, '../../landing/html/landing.html'));
    });

    app.get("/login", function (req, res) {
        res.sendfile(path.join(__dirname, '../html', 'login.html'));
    });

    app.get("/post-challenge", function (req, res) {
        res.sendfile(path.join(__dirname, '../html', 'challenge-submit.html'));
    });


    // todo: remove, just for testing
    console.log(db.query('SELECT $1::int AS number', ['1']));
};
