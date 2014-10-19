var path = require('path');
var db = require('./database-requests.js');
exports.start = function (app) {

    //entry point

    app.get("/login", function (req, res) {
        res.sendfile(path.join(__dirname, '../html', 'login.html'));
    });

    app.get("/post-challenge", function (req, res) {
        res.sendfile(path.join(__dirname, '../html', 'challenge-submit.html'));
    });

    app.post("/get-categories", function (req, res) {
        db.getCategories(function (categories) {
            res.send(categories.rows);
        });
    });
    app.post("/create-challenge", function(req, res){
    console.log('REQUEST == ' + req.body.difficulty);
    //Insert into db here
    });
    app.get('*', function (req, res) {
        res.sendfile(path.join(__dirname, '../../landing/html/landing.html'));
    });
};
