var userDAO = require('../model/usersMdl');
var passwordManager = require('../managePasswords');
var allPasswordsEncrypter = require('../encryptAllPasswords');

exports.getUser = function (username, req, res, messages) {

    var loginCallback = function (user) {
        user = user.rows[0];
        if (user && user.username === req.body.username) { // comentar segunda condicao para encriptacao
            passwordManager.comparePassword(req.body.password, user.pass, function (err, passwordMatch) {
                if (passwordMatch) {
                    req.session.regenerate(function () {
                        req.session.user = user;
                        res.status(200).send("OK");
                    });
                } else {
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

    passwordManager.cryptPassword(password, null, function (err, hash, password) {
        userDAO.register(username, hash, name, email, work, local, 'user', 'normal', registerCallback);
    });
}

exports.getProfile = function (data, id, res, messages, globals, self) {

    var loginCallback = function (results) {
        user = results.rows[0];
        if (!self) {
            console.log(user);
            var hasRequest = function (result) {
                if (result.rowCount == 0) {

                    res.render('profile.ejs', {
                        user      : user,
                        title     : 'Profile',
                        messages  : messages,
                        globals   : globals,
                        self      : self,
                        hasRequest: false
                    });
                } else {
                    res.render('profile.ejs', {
                        user      : user,
                        title     : 'Profile',
                        messages  : messages,
                        globals   : globals,
                        self      : self,
                        hasRequest: true
                    });
                }
            };

            userDAO.findFriendRequest(user.userid, id, hasRequest);
        } else {
            userDAO.getFriends(user.userid, renderProfile);
        }

    }

    var renderProfile = function (results) {
        var friends = [];
        friends.push(results.rows[0]);
        friends.push(results.rows[1]);
        friends.push(results.rows[2]);
        console.log(results.rows);
        res.render('profile.ejs', {
            user      : user,
            title     : 'Profile',
            messages  : messages,
            globals   : globals,
            self      : self,
            friends   : friends,
            hasRequest: false
        });
    }

    userDAO.getUser(data, loginCallback);
};

exports.getUserByUsername = function (username, res) {

    var loginCallback = function (results) {
        res.send(results.rows[0]);
    }

    userDAO.getUser(username, loginCallback);
}

exports.editProfile = function (data, res) {

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

    var loginCallback = function (results) {
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

            passwordManager.comparePassword(oldPassword, results.rows[0].pass, function (err, match) {
                if (match) {
                    passwordManager.cryptPassword(newPassword, null, function (err, hash, password) {
                        userDAO.updateUserWithPass(data.user.id, username, hash, name, email, work, hometown, updateCallback);
                    });
                } else {
                    res.status(400).send("Wrong value for oldPassword");
                }
            });
        } else {
            userDAO.updateUser(data.user.id, username, name, email, work, hometown, updateCallback);
        }

    }

    userDAO.getUserByID(data.user.id, loginCallback);
}

exports.addFriendRequest = function (user, res, friend, globals, messages, senderUsername, sockets) {

    if (user != friend) {
        var friendCallback = function (results) {
            if (!results) {
                console.log("ola");
                res.status(400).send("Error making request");
            } else {
                sockets[senderUsername].emit('notification', "Friend Request sent!");

                    if (sockets[friend] != undefined)
                        sockets[friend].emit('notification', "User " + senderUsername + " sent you a Friend request");
                    res.status(200).send("OK");

            }
        };

        var getUsername1 = function (result) {
            console.log(result.rows);
            userDAO.addFriend(result.rows[0].userid, user, "amizade", 0, friendCallback);
        }

        console.log(friend);
        userDAO.getUser(friend, getUsername1);

    } else {
        console.log("y u do dis");
        res.status(400).send("Error making request");
    }

}

exports.sendNotifications = function (username, socket) {
    var getUser = function (user) {
        var id = user.rows[0].userid;

        var getNotifications = function (results) {
            for (var i = 0; i < results.rowCount; i++) {
                var type = results.rows[i].type;
                var sender = results.rows[i].senderid;
                if (type === "amizade") {   //TODO other types
                    var getUsername = function (result) {

                        socket.emit('notification', "User " + result.rows[0].username + " sent you a Friend request");
                    }
                    userDAO.getUserByID(sender, getUsername);
                }
            }
        }

        userDAO.getAllNotifications(id, "unread", getNotifications);
    };

    userDAO.getUser(username, getUser)
}

exports.answerRequest = function(userid, friendName, type, res) {

    var getUsername = function (result) {
        if (result.rows[0].userid == undefined)
            res.status(400).send(false);

        var friendid = result.rows[0].userid;

        if (type === "postpone") {
            var postpone = function(results) {
                if (!results) {
                    res.status(400).send(false);
                } else {
                    res.status(200).send(true);
                }
            }
            userDAO.postponeNotification(userid, friendid, postpone);
        }

    }
    userDAO.getUser(friendName, getUsername);
}
