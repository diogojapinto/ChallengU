var db = require('./database-setup.js');

var getCategories = function (callback) {
    db.query("SELECT name FROM Category", [], callback);

};

exports.getCategories = getCategories;
