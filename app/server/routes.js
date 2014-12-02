var path = require('path');
var challengeFn = require('./controller/challengesCtrl');
var userFn = require('./controller/usersCtrl');
var allPasswordsEncrypter = require('./encryptAllPasswords');
var bcrypt = require('bcrypt');
var async = require('async');
var userDAO = require('./model/usersMdl');
var nodemailer = require('nodemailer');
var passwordManager = require('./managePasswords');

exports.listen = function (app, passport, io) {

    var connectedUsers = {};

    io.on('connection', function (client) {
        client.on('online', function (msg) {
            connectedUsers[msg.username] = client;
        })
    });

    app.get('/logout', function (req, res) {
        var messages = generateMessageBlock();
        var globals = generateGlobals(req);
        // destroy the user's session to log them out
        // will be re-created next request
        if (req.session.user) {
            req.session.destroy(function () {
                messages.success.push({title: "Logged Out", content: "You are now logged out!"});
                res.render("landing.ejs", {landing: true, messages: messages, title: 'Landing', globals: globals});
            });
        } else {
            messages.warning.push({title: "Sign in first", content: "You are not logged in"});
            res.render("landing.ejs", {landing: true, messages: messages, title: 'Landing', globals: globals});
        }
    });

    app.get("/connect/:val", function (req, res) {
        var messages = generateMessageBlock();
        var globals = generateGlobals(req);
        if (req.params.val == "error-login") {
            messages.danger.push({title: "Error", content: "There was an error logging you in!"});
        }
        res.render('connect.ejs', {messages: messages, title: 'Connect', globals: globals});
    });

    app.get("/connect", function (req, res) {
        var messages = generateMessageBlock();
        var globals = generateGlobals(req);
        if (req.session.user) {
            res.redirect('/invalid');
        }
        res.render('connect.ejs', {messages: messages, title: 'Connect', globals: globals});
    });

    app.get("/post-challenge/:val", function (req, res) {
        var messages = generateMessageBlock();
        var globals = generateGlobals(req);
        if (req.params.val == "error-challenge") {
            messages.danger.push({title: "Error", content: "There was an error creating your challenge!"});
        }
        res.render('challenge-submit.ejs', {
            messages: messages,
            globals : globals,
            title   : 'Submit your challenge'
        });
    });

    app.get("/post-challenge", function (req, res) {
        var globals = generateGlobals(req);
        var messages = generateMessageBlock();
        if (req.session.user) {
            res.render('challenge-submit.ejs', {
                messages: messages,
                globals : globals,
                title   : 'Submit your challenge'
            });
        } else {
            messages.warning.push("You must first login")
            res.redirect('/connect');
        }
    });

    app.post("/add-friend", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            var globals = generateGlobals(req);

        } else {//TODO IMPLEMENT

        }
    });

    app.get("/profile", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            var globals = generateGlobals(req);
            connectedUsers[req.session.user.username].emit('notification', {success: "success"});
            userFn.getProfile(req.session.user.userid, res, messages, globals, connectedUsers[req.session.user.username]);
        } else {
            res.redirect('/connect');
        }
    });

    app.get("/profile/:id", function (req, res) {
        var messages = generateMessageBlock();
        var userID = parseInt(req.params.id);
        if (req.session.user) {
            var globals = generateGlobals(req);
            userFn.getProfile(userID, res, messages);
        } else {
            res.redirect('/connect');
        }
    });

    app.get("/challenge/:id", function (req, res) {
        var messages = generateMessageBlock();
        var globals = generateGlobals(req);
        if (req.session.user) {
            var challengeID = parseInt(req.params.id);
            challengeFn.getChallenge(challengeID, res, messages, globals);
        } else {
            res.redirect('/connect');
        }
    });

    app.get("/search/:val", function (req, res) {
        var messages = generateMessageBlock();
        var globals = generateGlobals(req);
        challengeFn.searchChallenges(req.params.val, res, messages, globals);
    });

    app.get("/edit-profile", function (req, res) {
        var messages = generateMessageBlock();
        var userID = parseInt(req.params.id);
        var globals = generateGlobals(req);
        if (req.session.user) {
            res.render('edit-profile.ejs', {
                user    : req.session.user.userid,
                title   : 'Edit your profile',
                messages: messages,
                globals : globals
            })
        } else {
            messages.danger.push("You don't have the permissions to access that link");
            res.status(400).send(false);
        }
    });

    app.post("/get-user/:id", function (req, res) {
        var userID = parseInt(req.params.id);
        if (req.session.user) {
            userFn.getUserByID(userID, res);
        } else {
            res.status(400).send(false);
        }
    });

    app.post("/get-categories", function (req, res) {
        if (req.session.user) {
            challengeFn.getCategories(res);
        } else {
            res.status(400).send(false);
        }
    });

    app.post("/edit-profile", function (req, res) {
        if (req.session.user) {
            console.log(req.body);
            userFn.editProfile(req.body, res);
        } else {
            res.redirect("/connect");
        }
    });

    app.post("/login", function (req, res) {
        var messages = generateMessageBlock();
        if (!req.session.user) {
            userFn.getUser(req.body.username, req, res, messages);
        } else {
            res.status(400).send("You are already signed in. Please logout first");
        }
    });

    app.get("/search-challenge", function (req, res) {
        var messages = generateMessageBlock();
        var globals = generateGlobals(req);
        res.render('dummy-search.ejs', {messages: messages, globals: globals, title: 'Search challenge'});
    });

    app.post("/register", function (req, res) {
        userFn.registerUser(req.body, res);
    });

    app.post("/create-challenge", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            challengeFn.insertChallenge(req.session.user.userid, req.body, res);
        } else {
            console.log("FAILED");
            messages.danger.push("Please login in order to create a challenge");
            res.status(400).send(false);
        }
    });

    app.post("/create-challenge-response", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            challengeFn.insertChallengeProof(req.session.user.userid, req.body, res);
        } else {
            messages.danger.push("Please login in order to post a challenge proof");
            res.status(400).send(false);
        }
    });

    app.get("/encrypt", function (req, res) {
        allPasswordsEncrypter.encryptAll();
        res.redirect('/');
    });

    app.post("/forgotPassword", function (req, res) {
        async.waterfall([
            function (done) {
                bcrypt.genSalt(10, function (err, buff) {
                    var token = buff.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                userDAO.getUserByMail(req.body.email, function (user) {
                    if (user.rows[0] == undefined) {
                        console.log("NO MAIL");
                        res.status(400).send("Email not registered");
                        return;
                    }
                    userDAO.setTokenForUser(user.rows[0].username, token, function (result) {

                    });
                    var smtpTransport = nodemailer.createTransport('SMTP', {
                        service: 'Mailgun',
                        auth   : {
                            user: 'postmaster@challengeu.com',
                            pass: '4e6cf06c34e9dcc98fa530ba5f8dc5c7'
                        }
                    });

                    var mailOptions = {
                        to     : user.rows[0].email,
                        from   : 'postmaster@challengeu.com',
                        subject: 'ChallengeU Password Reset',
                        text   : 'You are receiving this mail because someone have requested the reset of the password.\n\n' +
                        'Please click on the following link, or paste it into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email.\n'
                    };

                    smtpTransport.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            res.status(400).send("Error sending email:" + err);
                            return;
                        }
                        else {
                            res.send(200);
                        }
                    });
                });
            }
        ])
    });

    app.get('/reset/:token', function (req, res) {
        var messages = generateMessageBlock();
        userDAO.getUserByToken(req.params.token, function (user) {
            if (user.rows[0] === undefined || user.rows[0] === 'null' || user.rows[0] === null || user.rows[0] === "null") {
                res.status(400).send("No such token");
                return;
            }

            res.render("reset.ejs", {messages: messages, title: 'Reset Password'});
        })
    });

    app.post('/reset', function (req, res) {
        console.log("TOKEN = " + req.body.token);
        userDAO.getUserByToken(req.body.token, function (user) {
            if (user.rows[0] === undefined) {
                res.status(400).send("No such token");
                return;
            }
            console.log("PASSWORD " + user.rows[0].username);
            passwordManager.cryptPassword(req.body.password, null, function (err, hash, password) {
                userDAO.updatePasswordByToken(req.body.token, hash, function (result) {
                    if (!result) {
                        res.status(400).send("Error updating password");
                        return;
                    }
                    else {
                        res.send(200);
                    }
                });
            });

        });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/facebook/callback', passport.authenticate('facebook'), function (req, res) {
        req.session.regenerate(function () {
            req.session.user = req.user;
            res.redirect('/profile/' + req.user.userid);
        });

    });

    app.get("/:val", function (req, res) {
        var messages = generateMessageBlock();
        var globals = generateGlobals(req);
        console.log(globals);
        if (req.params.val == "logged-in") {
            messages.success.push({title: "Logged In", content: "You are now logged in!"});
            challengeFn.getChallengesHome(res, messages, globals);
            return;
        } else if (req.params.val == "invalid") {
            messages.danger.push({title: "Invalid action", content: "You performed an invalid action!"});
        }
        res.render("landing.ejs", {landing: true, messages: messages, title: 'Landing', globals: globals});
    });

    app.get('*', function (req, res) {
        var messages = generateMessageBlock();
        var globals = generateGlobals(req);
        if (req.session.user) {
            challengeFn.getChallengesHome(res, messages, globals);
            return;
        }
        res.render("landing.ejs", {landing: true, messages: messages, title: 'Landing', globals: globals});
    });

};

var generateMessageBlock = function () {
    return {
        success: [],
        info   : [],
        warning: [],
        danger : []
    };
}

var generateGlobals = function (req) {
    var ret;
    if (req.session.user) {
        ret = {
            username: req.session.user.username,
            logged  : true
        }
    } else {
        ret = {
            username: "",
            logged  : false
        }
    }
    return ret;
}
