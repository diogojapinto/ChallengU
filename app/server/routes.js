var path = require('path');
var challengeFn = require('./controller/challengesCtrl');
var userFn = require('./controller/usersCtrl');
var allPasswordsEncrypter = require('./encryptAllPasswords');
var bcrypt = require('bcrypt');
var async = require('async');
var userDAO = require('./model/usersMdl');
var nodemailer = require('nodemailer');
var passwordManager = require('./managePasswords');

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

    app.post("/create-challenge-response", function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            challengeFn.insertChallengeProof(req.session.user.userid, req.body, res);
        } else {
            messages.errors.push("Please login in order to post a challenge proof");
            res.status(400).send(false);
        }
    });

    app.get("/encrypt", function(req, res){
        allPasswordsEncrypter.encryptAll();
        res.redirect('/');
    });

    app.post("/forgotPassword", function(req, res){
       async.waterfall([
          function(done){
            bcrypt.genSalt(10, function(err, buff){
                var token = buff.toString('hex');
                done(err, token);
            });
          },
            function(token, done){
                userDAO.getUserByMail(req.body.email, function(user){
                    if(user.rows[0] == undefined){
                        console.log("NO MAIL");
                        res.status(400).send("Email not registered");
                        return;
                    }
                    userDAO.setTokenForUser(user.rows[0].username, token, function(result){

                    });
                    var smtpTransport = nodemailer.createTransport('SMTP',{
                        service: 'Mailgun',
                        auth:{
                            user: 'postmaster@challengeu.com',
                            pass: '4e6cf06c34e9dcc98fa530ba5f8dc5c7'
                        }
                    });

                    var mailOptions = {
                        to: user.rows[0].email,
                        from: 'postmaster@challengeu.com',
                        subject: 'ChallengeU Password Reset',
                        text: 'You are receiving this mail because someone have requested the reset of the password.\n\n'+
                            'Please click on the following link, or paste it into your browser to complete the process:\n\n'+
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                            'If you did not request this, please ignore this email.\n'
                    };

                    smtpTransport.sendMail(mailOptions, function(err, info){
                        if(err){
                            res.status(400).send("Error sending email:"+err);
                            return;
                        }
                        else{
                            res.send(200);
                        }
                    });
                });
            }
        ])
    });

    app.get('/forgotPassword', function(req, res){
        var messages = generateMessageBlock();
        res.render("forgot.ejs",{messages: messages, title: 'Forgot Password'} );
    });

    app.get('/reset/:token', function(req,res){
        var messages = generateMessageBlock();
        userDAO.getUserByToken(req.params.token, function(user){
          if(user.rows[0] === undefined || user.rows[0] === 'null' || user.rows[0] === null || user.rows[0] === "null"){
              res.status(400).send("No such token");
              return;
          }

           res.render("reset.ejs", {messages: messages, title: 'Reset Password'});
        })
    });

    app.post('/reset', function(req, res){
        console.log("TOKEN = " + req.body.token);
        userDAO.getUserByToken(req.body.token, function(user){
            if(user.rows[0] === undefined){
                res.status(400).send("No such token");
                return;
            }
            console.log("PASSWORD " + user.rows[0].username);
            passwordManager.cryptPassword(req.body.password, null, function(err, hash, password){
                userDAO.updatePasswordByToken(req.body.token, hash, function(result){
                    if(!result){
                        res.status(400).send("Error updating password");
                        return;
                    }
                    else{
                        res.send(200);
                    }
                });
            });

        });
    });
    app.get("/:val", function (req, res) {
        var messages = generateMessageBlock();
        if (req.params.val == "logged-in") {
            messages.success.push({title: "Logged In", content: "You are now logged in!"});
            challengeFn.getChallengesHome(res, messages);
            return;
        } else if (req.params.val == "invalid") {
            messages.danger.push({title: "Invalid action", content: "You performed an invalid action!"});
        }
        res.render("landing.ejs", {messages: messages, title: 'Landing'});
    });

    app.get('*', function (req, res) {
        var messages = generateMessageBlock();
        if (req.session.user) {
            challengeFn.getChallengesHome(res, messages);
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
