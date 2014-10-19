var path = require('path');
var db = require('./database-requests.js');
exports.start = function (app) {

    //entry point

    app.get('/logout', function (req, res) {
        // destroy the user's session to log them out
        // will be re-created next request
        req.session.destroy(function () {
            res.redirect('/');
        });
    });

    app.get("/login", function (req, res) {
        res.sendfile(path.join(__dirname, '../html', 'login.html'));
    });

    app.get("/post-challenge", function (req, res) {
        if (req.session.user) {
            res.sendfile(path.join(__dirname, '../html', 'challenge-submit.html'));
        } else {

        }
    });

    app.post("/get-categories", function (req, res) {
        if (req.session.user) {
            db.getCategories(function (categories) {
                res.send(categories.rows);
            });
        }
    });

    app.post("/login-user", function (req, res) {
        db.getUser(req.body.username, function (user) {
            var user = user.rows[0];
            if (user && user.pass === req.body.password && user.username === req.body.username) {
                req.session.regenerate(function () {
                    req.session.user = user;
                    res.status(200).send("OK");
                });
            } else {
                res.status(404).send("NOT OK");
            }
        });
    });

    app.post("/create-challenge", function (req, res) {
        db.insertChallenge(req.body, function (isfine) {
            if (isfine && req.session.user) {
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
