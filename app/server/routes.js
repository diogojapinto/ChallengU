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

    app.get("/connect", function (req, res) {
        var messages = generateMessageBlock();
        if(req.session.user) {
            res.redirect('/invalid');
        }
        res.render('connect.ejs', {messages: messages, title: 'Connect'});
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
            res.redirect('/connect');
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
            challengeFn.insertChallenge(req.body, res);
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
        } else if (req.params.val == "invalid") {
            messages.danger.push({title: "Invalid action", content: "You performed an invalid action!"});
        }
        res.render("landing.ejs", {messages: messages, title: 'Landing'});
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
