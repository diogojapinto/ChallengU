var path = require('path');
var challengeFn = require('./controller/challengesCtrl');
var userFn = require('./controller/usersCtrl');
var allPasswordsEncrypter = require('./encryptAllPasswords');

exports.listen = function (app) {

    app.get('/logout', function (req, res) {
        var messages = generateMessageBlock();
        // destroy the user's session to log them out
        // will be re-created next request
        if (req.session.user) {
            req.session.destroy(function () {
                messages.success.push({title: "Logged Out", content: "You are now logged out!"});
                res.render("landing.ejs", {messages: messages, title:'Landing'});
            });
        } else {
            messages.success.push({title: "Sign in first", content: "You are not logged in"});
            res.render("landing.ejs", {messages: messages, title:'Landing'});
        }
    });

    app.get("/connect/:val", function (req, res) {
        var messages = generateMessageBlock();
        if (req.params.val == "error-login") {
            messages.danger.push({title: "Error", content: "There was an error logging you in!"});
        }
        res.render('connect.ejs', {messages: messages, title: 'Connect'});
    });

    app.get("/connect", function (req, res) {
        var messages = generateMessageBlock();
        if(req.session.user) {
            res.redirect('/invalid');
        }
        res.render('connect.ejs', {messages: messages, title: 'Connect'});
    });

    app.get("/post-challenge/:val", function (req, res) {
        var messages = generateMessageBlock();
        if (req.params.val == "error-challenge") {
            messages.danger.push({title: "Error", content: "There was an error creating your challenge!"});
        }
        res.render('challenge-submit.ejs', {messages: messages, title: 'Submit your challenge'});
    });

    app.get("/post-challenge", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            res.render('challenge-submit.ejs', {messages: messages, title: 'Submit your challenge'});
        } else {
            messages.warning.push("You must first login")
            res.redirect('/connect');
        }
    });

    app.get("/profile", function (req, res) {
        var messages = generateMessageBlock();
        var userID = parseInt(req.params.id);
        if (req.session.user) {
            userFn.getProfile(req.session.user.userid, res, messages);
        } else {
            res.redirect('/connect');
        }
    });

    app.get("/challenge/:id", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            var challengeID = parseInt(req.params.id);
            challengeFn.getChallenge(challengeID, res, messages);
        } else {
            res.redirect('/connect');
        }
    });

    app.get("/search/:val", function (req, res) {
        var messages = generateMessageBlock();
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

    app.get("/search-challenge", function (req, res) {
        var messages = generateMessageBlock();
        res.render('dummy-search.ejs', {messages: messages, title: 'Search challenge'});
    });

    app.post("/register", function (req, res) {
        var messages = generateMessageBlock();
        userFn.registerUser(req.body, res);
    });

    app.post("/create-challenge", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            challengeFn.insertChallenge(req.session.user.userid, req.body, res);
        } else {
            messages.errors.push("Please login in order to create a challenge");
            res.status(400).send(false);
        }
    });

    app.get("/encrypt", function(req, res){
        allPasswordsEncrypter.encryptAll();
        res.redirect('/');
    });


    app.get("/:val", function (req, res) {
        var messages = generateMessageBlock();
        if (req.params.val == "logged-in") {
            messages.success.push({title: "Logged In", content: "You are now logged in!"});
            res.render("home.ejs", {messages: messages, title: 'Home'});
            return;
        } else if (req.params.val == "invalid") {
            messages.danger.push({title: "Invalid action", content: "You performed an invalid action!"});
        }
        res.render("landing.ejs", {messages: messages, title: 'Landing'});
    });

    app.get('*', function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            res.render("home.ejs", {messages: messages, title: 'Home'});
            return;
        }
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
