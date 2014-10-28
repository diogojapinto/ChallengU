var db = require('./database-setup.js');

var getCategories = function (callback) {
    db.query("SELECT * FROM Category", [], callback);
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
    for (var i = 0; i < data.category.length; i++) {
        categories[i] = data.category[i];
    }

    db.insertChallenge(name, difficulty, type, desc, categories, callback);
};



var getChallenge = function(challengeID, callback) {
    var queries = [];
    var     args = [];
    queries.push("SELECT Challenge.name, username, content, difficulty, target, type " +
        "FROM Challenge INNER JOIN RegisteredUser ON RegisteredUser.userID = Challenge.userID " +
        "WHERE challengeID = $1::int");
    args.push([challengeID]);

    queries.push("SELECT name " +
        "FROM Category INNER JOIN ChallengeCategory ON Category.categoryID = ChallengeCategory.categoryID " +
        "WHERE challengeID = $1::int");
    args.push([challengeID]);

    queries.push("SELECT AVG(rating) " +
        "FROM RateChallenge " +
        "WHERE challengeID = $1::int");
    args.push([challengeID]);

    queries.push("SELECT username, content " +
        "FROM Comment INNER JOIN RegisteredUser ON RegisteredUser.userID = Comment.userID " +
        "WHERE challengeID = $1::int");
    args.push([challengeID]);

    queries.push("SELECT username, content, AVG(rating) AS average_rating " +
        "FROM ChallengeProof INNER JOIN RegisteredUser ON ChallengeProof.userID = RegisteredUser.userID " +
        "INNER JOIN RateChallengeProof ON ChallengeProof.proofID = RateChallengeProof.proofID " +
        "WHERE challengeID = $1::int " +
        "GROUP BY username, content " +
        "ORDER BY average_rating");
    args.push([challengeID]);

    db.transaction(queries, args, callback);
}

exports.getCategories = getCategories;
exports.getUser = getUser;
exports.insertChallenge = insertChallenge;
exports.getChallenge = getChallenge;
