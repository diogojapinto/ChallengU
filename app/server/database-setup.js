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

exports.insertChallenge = function (name, difficulty, type, desc, categories, callback) {
  pg.connect(conString, function (err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    client.query("SELECT categoryID FROM Category WHERE name = $1", [name], function(err, result){
      if(err) return console.error('error running query', err);
      console.log(result.rows[0]);
    });


    var tx = new Transaction(client);


  });
};
