var db = require('../controller/database-setup.js');

var getUser = function (username,callback) {
    db.query("SELECT * FROM RegisteredUser WHERE username=" + "'" + username + "'", [], callback);
};

exports.getCategories = getCategories;
exports.getUser = getUser;
exports.insertChallenge = insertChallenge;
exports.getChallenge = getChallenge;
