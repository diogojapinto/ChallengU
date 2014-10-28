var path = require('path');
var challengeFn = require('./controller/challengesCtrl');
var userFn = require('./controller/usersCtrl');
exports.listen = function (app) {

    var errors = [];

    app.get('/logout', function (req, res) {
        // destroy the user's session to log them out
        // will be re-created next request
        if (req.session.user) {
            req.session.destroy(function () {
                res.redirect('/');
            });
        } else {
            errors.push('Invalid action. Please login first');
            req.redirect('/');
        }
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
        if (req.session.user) {
            var challengeID = parseInt(req.params.id);
            challengeFn.getChallenge(challengeID, res);
        }
    });

    app.post("/get-categories", function (req, res) {
        if (req.session.user) {
            challengeFn.getCategories(res);
        } else {
            res.status(400).send(false);
        }
    });

    app.post("/login", function (req, res) {
        if (!req.session.user) {
            userFn.getUser(req.body.username, req, res);
        } else {
            errors.push("You are already signed in. Please logout first");
            res.status(400).send(false);
        }
    });

    app.get("/register", function (req, res) {
        res.sendfile(path.join(__dirname, '../views', 'register.html'));
    });

    app.post("/register", function (req, res) {

    });

    app.post("/create-challenge", function (req, res) {
        if (req.session.user) {
            challengeFn.insertChallenge(req.body, res);
        } else {
            errors.push("Please login in order to create a challenge");
            res.status(400).send(false);
        }
    });

    app.get('*', function (req, res) {
        res.sendfile(path.join(__dirname, '../views', 'landing.html'));
    });
};
