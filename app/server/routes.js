var path = require('path');
var challengeFn = require('./controller/challengesCtrl');
var userFn = require('./controller/usersCtrl');
exports.listen = function (app) {

    var messages = {
        success: [],
        info  : [],
        warning: [],
        danger: []
    };

    app.post('/logout', function (req, res) {
        // destroy the user's session to log them out
        // will be re-created next request
        if (req.session.user) {
            req.session.destroy(function () {
                res.redirect('/loggedout');
            });
        } else {
            messages.danger.push({title: "Sign in first", content: "You are not logged in"});
            req.redirect('/');
        }
    });

    app.get("/connect", function (req, res) {
        res.render('connect.ejs', {messages: messages, title: 'Connect'});
    });

    app.get("/post-challenge", function (req, res) {
        if (req.session.user) {
            res.render('challenge-submit.ejs', {messages: messages, title: 'Submit your challenge'});
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
            res.status(400).send("You are already signed in. Please logout first");
        }
    });

    app.get("/register", function (req, res) {
        res.render('register.ejs', {messages: messages, title: 'Register'});
    });

    app.get("/search-challenge", function (req, res) {
        res.render('dummy-search.ejs', {messages: messages, title: 'Search challenge'});
    });

    app.post("/register", function (req, res) {
        console.log(req.body);
        userFn.registerUser(req.body, res);
    });

    app.post("/create-challenge", function (req, res) {
        if (req.session.user) {
            challengeFn.insertChallenge(req.body, res);
        } else {
            errors.push("Please login in order to create a challenge");
            res.status(400).send(false);
        }
    });

    app.get("/:val", function (req, res) {
        if (req.params.val == "loggedin") {
            messages.success.push({title: "Logged In", content: "You are now logged in!"});
            res.render("landing.ejs", {messages: messages});
        }
        if (req.params.val == "loggedout") {
            messages.success.push({title: "Logged Out", content: "You are now logged out!"});
            res.render("landing.ejs", {messages: messages});
        }
    });

    app.get('*', function (req, res) {
        res.render("landing.ejs", {messages: messages});
    });
}
;
