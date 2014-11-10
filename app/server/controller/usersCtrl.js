var userDAO = require('../model/usersMdl');
var passwordManager = require('../managePasswords');
var allPasswordsEncrypter = require('../encryptAllPasswords');

exports.getUser = function (username, req, res) {

    var loginCallback = function (user) {
        user = user.rows[0];
        if (user && user.username === req.body.username) { // comentar segunda condicao para encriptacao
            passwordManager.comparePassword(req.body.password, user.pass, function(err, passwordMatch){
                if(passwordMatch){
                    req.session.regenerate(function () {
                        req.session.user = user;
                        res.status(200).send("OK");
                    });
                }else{
                    res.status(400).send("NOT OK");
                }
            });
        } else {
            res.status(400).send("NOT OK");
        }
    };

    userDAO.getUser(username, loginCallback);
};

exports.registerUser = function (data, res) {
    var username = data.username;
    var password;
    var name = data.firstName + " " + data.lastName;
    var email = data.email;
    var work = data.work;
    var local = data.local;

    if (data.password == data.confirmPassword) {
        password = data.password;
        console.log("PASSWORD = ", password);
    } else {
        res.status(400).send("Passwords must match!");
        return;
    }

    if (data.password.length <= 6) {
        res.status(400).send("Password length must be greater than 6!");
        return;
    }

    if (data.username.length <= 4) {
        res.status(400).send("Username length must be greater than 4!");
        return;
    }

    var registerCallback = function (results) {
        if (!results) {
            res.status(400).send(false);
        } else {
            res.status(200).send(true);
        }
    }


    passwordManager.cryptPassword(password, null, function(err, hash, password){
        userDAO.register(username,hash,name,email,work,local,'user','normal',registerCallback);
    });//Descomentar para encriptacao



}

exports.getProfile = function (data,res,messages) {

    var user;

    var loginCallback = function(results) {
        user = results.rows[0];
        console.log(results.rows);
        res.render('profile.ejs', {user:user, title: 'Profile', messages: messages})
    }

    userDAO.getUserByID(data, loginCallback);
};