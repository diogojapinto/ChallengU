var db = require('../database-setup.js');

exports.getUser = function (username, callback) {
    db.query("SELECT * FROM RegisteredUser WHERE username=" + "'" + username + "'", [], callback);
};

exports.register = function (username, password, name, email, work, hometown, userType, userState, callback) {
    db.query("INSERT INTO RegisteredUser (userID, username, pass, name, email, work, hometown, lastFreePoints, xp, userType, userState) VALUES (DEFAULT,"+"'"+username+"'"+","+"'"+password+"'"+","+"'"+name+"'"+","+"'"+email+"'"+","+"'"+work+"'"+","+"'"+hometown+"'"+",DEFAULT,DEFAULT,"+"'"+userType+"'"+","+"'"+userState+"'"+")", [], callback);
};

exports.getUserByID = function(userID,callback) {
    db.query("SELECT * from RegisteredUser WHERE userID = " + userID, [], callback);
};

exports.getUserByMail = function(mail, callback){
    db.query("SELECT * FROM RegisteredUser WHERE email =" + "'" + mail + "'", [], callback);
};

exports.setTokenForUser = function(user, token, callback){
    db.query("UPDATE RegisteredUser SET passwordToken =" + "'" + token + "' " + "WHERE username =" + "'" + user + "'", [], callback);
};
exports.getUserByToken = function(token, callback){
    db.query("SELECT * from RegisteredUser WHERE passwordToken =" + "'" + token + "'", [], callback);
};

exports.updatePasswordByToken = function(token, password, callback){
    db.query("UPDATE RegisteredUser SET pass=" + "'" + password + "', passwordToken = 'null' WHERE passwordToken =" + "'" + token + "'", [], callback);
};