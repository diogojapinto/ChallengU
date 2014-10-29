var path = require('path');
var challengeFn = require('./controller/challengesCtrl');
var userFn = require('./controller/usersCtrl');
exports.listen = function (app) {

    var errors = [];

    app.post('/logout', function (req, res) {
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
        res.render('login.ejs', {title: 'Login'});
    });

    app.get("/post-challenge", function (req, res) {

        if (req.session.user) {
            res.render('challenge-submit.ejs', {title: 'Submit your challenge'});
        } else {
            res.redirect('/login');
        }
    });

    app.get("/challenge/:id", function (req, res) {
        if (req.session.user) {
            var challengeID = parseInt(req.params.id);
            challengeFn.getChallenge(challengeID, res);
        } else {
            res.redirect('/login');
        }
    });

    app.get("/search/:val", function (req, res) {
        console.log("Val: " + req.params.val);
        challengeFn.searchChallenges(req.params.val, res);
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
        res.render('register.ejs', {title: 'Register'});
    });

    app.get("/search-challenge", function (req, res) {
        res.render('dummy-search.ejs', {title: 'Search challenge'});
    });

    app.post("/search-challenge", function (req, res) {
        challengeFn.searchChallenges(req.body.searchValue,res);
    });

    app.post("/register", function (req, res) {
        console.log(req.body);
        userFn.registerUser(req.body,res);
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
