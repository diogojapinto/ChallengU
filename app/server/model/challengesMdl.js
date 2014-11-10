var db = require('../database-setup.js');

exports.getCategories = function (callback) {

    db.query("SELECT * FROM Category", [], callback);
};

exports.insertChallenge = function (userid, name, difficulty, type, desc, categories, callback) {
    var queries = [];
    var args = [];

    queries.push("INSERT INTO Challenge (challengeID, name, userID, content, difficulty, target, type, targetUserID) " +
        "VALUES (DEFAULT, $1,$2,$3,$4::int,$5,$6, $7)");
    args.push([name, userid, desc, parseInt(difficulty), 'community', type, null]);

    for (var i = 0; i < categories.length; i++) {
        queries.push("INSERT INTO ChallengeCategory (challengeID, categoryID) VALUES (CURRVAL('challenge_challengeid_seq'), $1)");
        args.push([categories[i]]);
    }

    queries.push("SELECT CURRVAL('challenge_challengeid_seq')");
    args.push([]);

    db.transaction(queries, args, callback);
};

exports.getChallenge = function (challengeID, callback) {
    var queries = [];
    var args = [];
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
};

exports.searchChallenge = function(searchValue, callback) {
  db.query("SELECT challenge.name, challenge.content, challenge.difficulty, registeredUser.username,coalesce((SELECT COUNT(*) FROM comment WHERE challenge.challengeID = comment.challengeID GROUP BY challenge.challengeID), 0) AS nComments FROM challenge, registeredUser WHERE challenge.userID = registeredUser.userID AND challenge.name SIMILAR TO '%"+searchValue+"%'GROUP BY challenge.challengeID, registeredUser.username ORDER BY nComments DESC",[],callback);
};