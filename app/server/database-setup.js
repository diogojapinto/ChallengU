var pg = require('pg');
var Transaction = require('pg-transaction');
var conString = "postgres://postgres:admin@localhost/challengeu";

/*
 * how to do args properly
 * 'SELECT $1::int AS number', ['1']
 */


/*
 * receives a base query (string) and corresponding args
 */
exports.query = function (baseQuery, args, callback) {

    pg.connect(conString, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(baseQuery, args, function (err, result) {

            // release client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }
            callback(result);
        });
    });
};

/**
 *
 * @param baseQueries array of queries composing the transaction
 * @param args matrix of args, by baseQuery
 * @param callback function called on success
 */
exports.transaction = function (baseQueries, args, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            console.error('error fetching client from pool', err);
            callback(null);
        }

        // results store in an array the results of each query
        var results = [];

        var tx = new Transaction(client);
        tx.begin();
        tx.savepoint('checkPoint');

        for(var i = 0; i < baseQueries.length; i++) {
            tx.query(baseQueries[i], args[i], function(err, result) {
                if (err) {
                    tx.rollback('checkPoint');
                    console.error('error running query', err);
                    callback(null);
                }

                results.push(result);
            });
        }

        tx.release('checkPoint');
        tx.commit();

        callback(results);

    });
};


exports.insertChallenge = function (name, difficulty, type, desc, categories, callback) { //O campo name nao esta na bd
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        var queryText = "SELECT categoryID FROM Category WHERE name = ";
        for (i = 0; i < categories.length; i++) {
            if (i != 0) queryText += " OR name = ";
            queryText += ("'" + categories[i] + "'");
        }

        client.query(queryText, function (err, result) {

            if (err) {
                return console.error('error running query', err);
            }

            var catIDs = result.rows;

            var tx = new Transaction(client);
            tx.begin();
            tx.savepoint('checkPoint');
            tx.query("INSERT INTO Challenge (userID, content, difficulty, target, type, targetUserID) VALUES ($1,$2,$3,$4,$5,$6) RETURNING challengeID",
                [1, desc, difficulty, 'community', type, 2], function (err, result) { //For testing, a challenge from user 1 to user 2
                    if (err) {
                        tx.rollback('checkPoint');
                        return console.error('error', err);
                    }
                    for (i = 0; i < catIDs.length; i++) {
                        tx.query("INSERT INTO ChallengeCategory (challengeID, categoryID) VALUES ($1, $2)", [result.rows[0].challengeID, catIDs[i]], function (err, result) {
                            if (err) {
                                tx.rollback('checkPoint');
                                return console.error('error', err);
                            }
                        });
                    }
                    tx.release('checkPoint');
                    tx.commit();
                });
        });

        //TODO: Testar esta query, fiz tudo a 'olho'


    });
};
