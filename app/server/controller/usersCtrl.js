var userDAO = require('../model/usersMdl');
var passwordManager = require('../managePasswords');
var allPasswordsEncrypter = require('../encryptAllPasswords');

exports.getUser = function (username, req, res, messages) {

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
    } else {
        res.status(400).send("Passwords must match!");
        return;
    }

    if (data.password.length <= 6) {
        res.status(400).send("Password length must be greater than 6!");
        return;
    }

    if (data.username.length <= 4 || data.username.length > 15) {
        res.status(400).send("Username length must be greater than 4 and lower than 15!");
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
    });
}

exports.getProfile = function (data,res,messages, globals, socket) {

    var loginCallback = function(results) {
        user = results.rows[0];
        res.render('profile.ejs', {user:user, title: 'Profile', messages: messages, globals: globals})
    }

    userDAO.getUserByID(data, loginCallback);
};

exports.getUserByID = function (userID,res) {

    var loginCallback = function(results) {
        res.send(results.rows[0]);
    }

    userDAO.getUserByID(userID, loginCallback);
}

exports.editProfile = function (data,res) {

    var username = data.user.username;
    var oldPassword = data.user.oldPassword, newPassword = data.user.newPassword, confirmPassword = data.user.confirmPassword;
    var name = data.user.firstName + " " + data.user.lastName;
    var email = data.user.email;
    var work = data.user.work;
    var hometown = data.user.hometown;

    var updateCallback = function (update) {
        if (!update) {
            res.status(400).send(false);
            return;
        } else {
            res.status(200).send(true);
            return;
        }
    }


    var loginCallback = function(results) {
        user = results.rows[0];
        console.log(results.rows);

        if (username.length <= 4 || username.length > 15) {
            res.status(400).send("Username length must be greater than 4 and lower than 15!");
            return;
        }

        if (data.pass) {
            if (newPassword == confirmPassword && oldPassword != newPassword && oldPassword != confirmPassword) {
                password = newPassword;
            } else {
                res.status(400).send("Passwords must match!");
                return;
            }

            if (newPassword.length <= 6 || oldPassword.length <= 6 || confirmPassword.length <= 6) {
                res.status(400).send("Password length must be greater than 6!");
                return;
            }

            passwordManager.comparePassword(oldPassword,results.rows[0].pass, function(err, match) {
                if (match) {
                    passwordManager.cryptPassword(newPassword, null, function(err, hash, password){
                        userDAO.updateUserWithPass(data.user.id,username,hash,name,email,work,hometown,updateCallback);
                    });
                } else {
                    res.status(400).send("Wrong value for oldPassword");
                }
            });
        } else {
            userDAO.updateUser(data.user.id,username,name,email,work,hometown,updateCallback);
        }



    }

    userDAO.getUserByID(data.user.id, loginCallback);
}
