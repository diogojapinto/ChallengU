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