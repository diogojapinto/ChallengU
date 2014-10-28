var path = require('path');
var challengeFn = require('controller/challenges.js');
var userFn = require('controller/users.js');
exports.listen = function (app) {

    //entry point

    app.get('/logout', function (req, res) {
        // destroy the user's session to log them out
        // will be re-created next request
        req.session.destroy(function () {
            res.redirect('/');
        });
    });

    app.get("/login", function (req, res) {
        res.sendfile(path.join(__dirname, '../views', 'login.html'));
    });

    app.get("/post-challenge", function (req, res) {

        if (req.session.user) {
            res.sendfile(path.join(__dirname, '../views', 'challenge-submit.html'));
        } else {
            res.redirect('/login');
        }
    });

    app.get("/challenge/:id", function (req, res) {
        var challengeID = parseInt(req.params.id);

        var challenge = challengeFn.getChallenge(challengeID);

        if (challenge == null) {
            res.sendfile(path.join(__dirname, '../views/landing.html'));
            return;
        } else {
            res.render('challenge.ejs', challenge);
            return;
        }

    });

    app.post("/get-categories", function (req, res) {
        if (req.session.user) {
            challengeFn.getCategories(function (categories) {
                res.send(categories.rows);
            });
        } else {
            res.redirect('/login');
        }
    });

    app.post("/login-user", function (req, res) {
        userFn.getUser(req.body.username, function (user) {
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
        challengeFn.insertChallenge(req.body, function (challengeID) {
            if (challengeID && req.session.user) {
                res.status(200).send(challengeID.toString());
            } else {
                res.status(404).send(false);
            }
        });
    });

    app.get('*', function (req, res) {
        res.sendfile(path.join(__dirname, '../views', 'landing.html'));
    });
};
