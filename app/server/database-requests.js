var db = require('./database-setup.js');

var getCategories = function () {
    console.log("getCategories");
    var test = db.query("SELECT name FROM Category", []);
    console.log(test);
};

exports.getCategories = getCategories;
