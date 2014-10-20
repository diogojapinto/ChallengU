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

    app.get("/challenge/:id", function (req, res) {
        var challengeID = req.params.id;


    });

    app.post("/get-categories", function (req, res) {
        db.getCategories(function (categories) {
            res.send(categories.rows);
        });
    });

    app.post("/login-user", function (req, res) {
        db.getUser(req.body.username,function (user) {
            if (user.rows != null && user.rows[0].pass === req.body.password && user.rows[0].username === req.body.username) {
                res.send("OK");
            } else {
                res.status(404).send("NOT OK");
            }
        });
    });

    app.post("/create-challenge", function(req, res){
        db.insertChallenge(req.body, function (isfine) {
            if (isfine) {
                res.send("OK");
            } else {
                res.send("FAIL");
            }
        });
    });
    app.get('*', function (req, res) {
        res.sendfile(path.join(__dirname, '../../landing/html/landing.html'));
    });
};
