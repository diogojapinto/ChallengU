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
            res.redirect('/login');
        }
    });

    app.get("/challenge/:id", function (req, res) {
        var challengeID = parseInt(req.params.id);

        var assembleChallenge = function(results) {

            if (results == null) {
                res.sendfile(path.join(__dirname, '../html/landing.html'));
            }

            var challenge = {};
            challenge.id = challengeID;

            // basic info
            challenge.name = results[0].rows[0].name;
            challenge.creator = results[0].rows[0].username;
            challenge.description = results[0].rows[0].content;
            challenge.difficulty = parseInt(results[0].rows[0].difficulty);
            challenge.target = results[0].rows[0].target;
            challenge.type = results[0].rows[0].type;

            // categories
            challenge.category = [];
            results[1].rows.forEach(function(category) {
                challenge.category.push(category);
            });

            // rating
            challenge.rating = parseFloat(results[2].rows[0].avg);

            // comments
            challenge.comments = [];
            results[3].rows.forEach(function(entry) {
                challenge.comments.push(entry);
            });

            // challenge proofs
            challenge.responses = [];
            results[4].rows.forEach(function(proof) {
                proof.rating = parseInt(proof.rating);
                challenge.responses.push(proof);
            });

            res.render('challenge.ejs', challenge);
        };

        db.getChallenge(challengeID, assembleChallenge);

    });

    app.post("/get-categories", function (req, res) {
        if (req.session.user) {
            db.getCategories(function (categories) {
                res.send(categories.rows);
            });
        } else {
            res.redirect('/login');
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
                res.status(200).send(true);
            } else {
                res.status(404).send(false);
            }
        });
    });
    app.get('*', function (req, res) {
        res.sendfile(path.join(__dirname, '../html/landing.html'));
    });
};
