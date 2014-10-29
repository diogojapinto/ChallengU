var userDAO = require('../model/usersMdl');

exports.getUser = function (username, req, res) {

    var loginCallback = function (user) {
        user = user.rows[0];
        if (user && user.pass === req.body.password && user.username === req.body.username) {
            req.session.regenerate(function () {
                req.session.user = user;
                res.status(200).send("OK");
            });
        } else {
            res.status(400).send("NOT OK");
        }
    };

    userDAO.getUser(username, loginCallback);
};

exports.registerUser = function(data, res){
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

    if (data.username.length <= 6) {
        res.status(400).send("Username length must be greater than 6!");
        return;
    }

    var registerCallback = function (results) {
        if(!results) {
            res.status(400).send(false);
        } else {
            res.status(200).send(true);
        }
    }

    userDAO.register(username,password,name,email,work,local,'user','normal',registerCallback);
}