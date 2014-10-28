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

/**
 *
 * @param baseQueries array of queries composing the transaction
 * @param args matrix of args, by baseQuery
 * @param callback function called on success
 */
exports.transaction = function (baseQueries, args, callback) {
    pg.connect(conString, function (err, client) {
        if (err) {
            console.error('error fetching client from pool', err);
            callback(null);
            return;
        }

        // results store in an array the results of each query
        var results = [];

        var tx = new Transaction(client);
        tx.begin();
        tx.savepoint('checkPoint');

        for (var i = 0; i < baseQueries.length; i++) {
            tx.query(baseQueries[i], args[i], function (err, result) {

                if (err) {
                    tx.rollback('checkPoint');
                    console.error('error running query', err);
                    callback(null);
                    return;
                }
                results.push(result);
                if (results.length == baseQueries.length) {
                    callback(results);
                }
            });
        }

        tx.release('checkPoint');
        tx.commit();
    });
};
