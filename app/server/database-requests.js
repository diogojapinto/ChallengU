var db = require('./database-setup.js');

var getCategories = function (callback) {
    db.query("SELECT name FROM Category", [], callback);
};

var getUser = function (username,callback) {
    db.query("SELECT * FROM RegisteredUser WHERE username=" + "'" + username + "'", [], callback);
};

var insertChallenge = function (data, callback) {
    var name = data.name;
    var difficulty = data.difficulty;
    var type = data.type;
    var desc;
    if (data.description != "" && data.description != undefined) {
        desc = data.description;
    } else {
        desc = "";
    }

    var categories = [];
    for (i = 0; i < data.category.length; i++) {
        categories[i] = data.category[i];
    }

    db.insertChallenge(name, difficulty, type, desc, categories, callback);
};

exports.getCategories = getCategories;
exports.getUser = getUser;
exports.insertChallenge = insertChallenge;