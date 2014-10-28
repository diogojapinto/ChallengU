var db = require('../controller/database-setup.js');

exports.getCategories = function() {
    db.query("SELECT * FROM Category", [], callback);
}

exports.insertChallenge = function (name, difficulty, type, desc, categories, callback) { //O campo name nao esta na bd
    pg.connect(conString, function (err, client, done) {
        if (err) {
            console.error('error fetching client from pool', err);
            callback(false);
            return;
        }

        var tx = new Transaction(client);
        tx.begin();
        tx.savepoint('checkPoint');
        tx.query("INSERT INTO Challenge (challengeID, name, userID, content, difficulty, target, type, targetUserID) VALUES (DEFAULT, $1,$2,$3,$4::int,$5,$6, $7) RETURNING challengeID",
            [name, 1, desc, parseInt(difficulty), 'community', type, null], function (err, result) { //For testing, a challenge from user 1 to user community
                if (err) {
                    tx.rollback('checkPoint');
                    console.error('error', err);
                    callback(false);
                    return;
                }
                var challengeID = result.rows[0].challengeid;

                for (i = 0; i < categories.length; i++) {
                    tx.query("INSERT INTO ChallengeCategory (challengeID, categoryID) VALUES ($1, $2)", [result.rows[0].challengeid, categories[i]], function (err, result) {
                        if (err) {
                            tx.rollback('checkPoint');
                            console.error('error', err);
                            callback(false);
                            return;
                        }

                        callback(challengeID);

                    });
                }
                tx.release('checkPoint');
                tx.commit();
            });
    });
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