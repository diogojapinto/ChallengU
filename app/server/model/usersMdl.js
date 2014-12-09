var db = require('../database-setup.js');
var passwordManager = require('../managePasswords');

exports.getUser = function (username, callback) {
    db.query("SELECT * FROM RegisteredUser WHERE username=" + "'" + username + "'", [], callback);
};

exports.getLikeUser = function (username, callback) {
    db.query("SELECT * FROM RegisteredUser WHERE username LIKE '%" + username + "%'", [], callback);
};

exports.register = function (username, password, name, email, work, hometown, userType, userState, callback) {
    db.query("INSERT INTO RegisteredUser (userID, username, pass, name, email, work, hometown, lastFreePoints, xp, userType, userState) VALUES (DEFAULT," + "'" + username + "'" + "," + "'" + password + "'" + "," + "'" + name + "'" + "," + "'" + email + "'" + "," + "'" + work + "'" + "," + "'" + hometown + "'" + ",DEFAULT,DEFAULT," + "'" + userType + "'" + "," + "'" + userState + "'" + ")", [], callback);
};

exports.updateUserWithPass = function (userID, username, password, name, email, work, hometown, callback) {
    db.query("UPDATE RegisteredUser SET username='" + username + "', pass='" + password + "', name='" + name + "',email='" + email + "',work='" + work + "',hometown='" + hometown + "' WHERE userID =" + userID, [], callback);
};

exports.updateUser = function (userID, username, name, email, work, hometown, callback) {
    db.query("UPDATE RegisteredUser SET username='" + username + "',name='" + name + "',email='" + email + "',work='" + work + "',hometown='" + hometown + "' WHERE userID =" + userID, [], callback);
};

exports.getUserByID = function (userID, callback) {
    db.query("SELECT * from RegisteredUser WHERE userID = " + userID, [], callback);
};

exports.getUserByMail = function (mail, callback) {
    db.query("SELECT * FROM RegisteredUser WHERE email =" + "'" + mail + "'", [], callback);
};

exports.setTokenForUser = function (user, token, callback) {
    db.query("UPDATE RegisteredUser SET passwordToken =" + "'" + token + "' " + "WHERE username =" + "'" + user + "'", [], callback);
};
exports.getUserByToken = function (token, callback) {
    db.query("SELECT * FROM RegisteredUser WHERE passwordToken =" + "'" + token + "'", [], callback);
};

exports.updatePasswordByToken = function (token, password, callback) {
    db.query("UPDATE RegisteredUser SET pass=" + "'" + password + "', passwordToken = 'null' WHERE passwordToken =" + "'" + token + "'", [], callback);
};

exports.getUserByFbId = function (id, callback) {
    db.query("SELECT * FROM RegisteredUser WHERE username =" + "'" + id + "'", [], callback);
}

exports.registerUserFb = function (id, token, name, email, callback) {
    var pass = Math.random().toString(36).slice(2);
    passwordManager.cryptPassword(pass, null, function (err, hash, pass) {
        db.query("INSERT INTO RegisteredUser (userID, username, pass, name, email, work, hometown, userType, userState) " +
        "VALUES (DEFAULT," + "'" + id + "'," + "'" + hash + "'," + "'" + name + "'," + "'" + email + "'," + "'none','none','user','normal') RETURNING *", [], callback);
    });
}

exports.addFriend = function (receiver, sender, type, info, callback) {
    db.query("INSERT INTO PersistentNotifications (notificationID, receiverID, senderID, type, info, status) VALUES (DEFAULT," + receiver + "," + sender + "," + "'" + type + "'" + "," + info + "," + "'unread'" + ")", [], callback);
};

exports.findFriendRequest = function (receiver, sender, callback) {
    //console.log("SELECT * FROM PersistentNotifications WHERE receiverID = " + receiver + " AND senderID = " + sender + " AND type LIKE 'amizade'");
    db.query("SELECT * FROM PersistentNotifications WHERE receiverID = " + receiver + " AND senderID = " + sender + " AND type LIKE 'amizade'", [], callback);
}

exports.getAllNotifications = function (receiver, type, callback) {
    if (type == "unread")
        db.query("SELECT * FROM PersistentNotifications WHERE receiverID = " + receiver + " AND status = 'unread'", [], callback);
}

exports.postponeNotification = function (receiver, sender, callback) {
    db.query("UPDATE PersistentNotifications SET status = 'read' WHERE receiverID = " + receiver + " AND senderID = " + sender + " AND type LIKE 'amizade'", [], callback);
}

exports.getFriends = function(userID,callback) {
    db.query("SELECT * FROM Friendship WHERE friend1 = " + userID, [], callback);
}