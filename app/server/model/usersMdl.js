var db = require('../database-setup.js');

exports.getUser = function (username,callback) {
    db.query("SELECT * FROM RegisteredUser WHERE username=" + "'" + username + "'", [], callback);
};

exports.register = function(username,password,name,email,work,hometown,userType,userState,callback) {
    var queries = [];
    var args = [];

    queries.push("INSERT INTO RegisteredUser (userID, username, pass, name, email, work, hometown, lastFreePoints, xp, userType, userState) " +
        "VALUES (DEFAULT, $1,$2,$3,$4,$5,$6, DEFAULT, DEFAULT, $7, $8)");
    args.push([username, password, name, email, work, hometown, userType, userState]);
} ;