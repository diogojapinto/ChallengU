var db = require('../database-setup.js');

exports.getUser = function (username,callback) {
    db.query("SELECT * FROM RegisteredUser WHERE username=" + "'" + username + "'", [], callback);
};