var pg = require('pg');
var conString = "postgres://postgres:wso277@localhost/challengeu";

/*
 * receives a base query (string) and corresponding args
 */
exports.query = function (baseQuery, args) {
    var ret;
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(baseQuery, args, function(err, result) {

            // release client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }
            ret = result;
        });
    });
    return ret;
};

