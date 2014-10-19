var db = require('./database-setup.js');

var getCategories = function (callback) {
    db.query("SELECT name FROM Category", [], callback);
};

var getUser = function (username,callback) {
    db.query("SELECT * FROM RegisteredUser WHERE username=" + "'" + username + "'", [], callback);
}

exports.getCategories = getCategories;
exports.getUser = getUser;
