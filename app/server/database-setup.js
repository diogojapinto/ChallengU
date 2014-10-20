var pg = require('pg');
var Transaction = require('pg-transaction');
var conString = "postgres://postgres:admin@localhost/challengeu";

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
                for (i = 0; i < categories.length; i++) {
                    tx.query("INSERT INTO ChallengeCategory (challengeID, categoryID) VALUES ($1, $2)", [result.rows[0].challengeid, categories[i]], function (err, result) {
                        if (err) {
                            tx.rollback('checkPoint');
                            console.error('error', err);
                            callback(false);
                            return;
                        }
                    });
                }
                tx.release('checkPoint');
                tx.commit();
            });
    });

    callback(true);

    //Testar esta query, fiz tudo a 'olho'
};
