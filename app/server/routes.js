var path = require('path');
var challengeFn = require('./controller/challengesCtrl');
var userFn = require('./controller/usersCtrl');
var allPasswordsEncrypter = require('./encryptAllPasswords');

exports.listen = function (app) {

    app.post('/logout', function (req, res) {
        var messages = generateMessageBlock();
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
        var messages = generateMessageBlock();
        res.render('connect.ejs', {messages: messages, title: 'Connect'});
    });

    app.get("/post-challenge", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            res.render('challenge-submit.ejs', {messages: messages, title: 'Submit your challenge'});
        } else {
            res.redirect('/login');
        }
    });

    app.get("/profile/:id", function (req, res) {
        var messages = generateMessageBlock();
        var userID = parseInt(req.params.id);
        //if (req.session.user) {
            userFn.getProfile(userID, res, messages);
        //} else {
            //res.redirect('/login');
        //}
    });

    app.get("/challenge/:id", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            var challengeID = parseInt(req.params.id);
            challengeFn.getChallenge(challengeID, res);
        } else {
            res.redirect('/login');
        }
    });

    app.get("/search/:val", function (req, res) {
        var messages = generateMessageBlock();
        console.log("Val: " + req.params.val);
        challengeFn.searchChallenges(req.params.val, res, messages);
    });

    app.post("/get-categories", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            challengeFn.getCategories(res);
        } else {
            res.status(400).send(false);
        }
    });

    app.post("/login", function (req, res) {
        var messages = generateMessageBlock();
        if (!req.session.user) {
            userFn.getUser(req.body.username, req, res);
        } else {
            res.status(400).send("You are already signed in. Please logout first");
        }
    });

    app.get("/register", function (req, res) {
        var messages = generateMessageBlock();
        res.render('register.ejs', {messages: messages, title: 'Register'});
    });

    app.get("/search-challenge", function (req, res) {
        var messages = generateMessageBlock();
        res.render('dummy-search.ejs', {messages: messages, title: 'Search challenge'});
    });

    app.post("/register", function (req, res) {
        var messages = generateMessageBlock();
        console.log(req.body);
        userFn.registerUser(req.body, res);
    });

    app.post("/create-challenge", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            challengeFn.insertChallenge(req.body, res);
        } else {
            errors.push("Please login in order to create a challenge");
            res.status(400).send(false);
        }
    });

    app.get("/encrypt", function(req, res){
        allPasswordsEncrypter.encryptAll();
        res.redirect('/');
    });


    app.get("/:val", function (req, res) {
        if (req.params.val == "loggedin") {
            messages.success.push({title: "Logged In", content: "You are now logged in!"});
        }
        if (req.params.val == "loggedout") {
            messages.success.push({title: "Logged Out", content: "You are now logged out!"});
        }
        res.render("landing.ejs", {messages: messages, title:'Landing'});
    });

    app.get('*', function (req, res) {
        var messages = generateMessageBlock();
        res.render("landing.ejs", {messages: messages, title:'Landing'});
    });
};

var generateMessageBlock = function() {
    return {
        success: [],
        info  : [],
        warning: [],
        danger: []
    };
}
