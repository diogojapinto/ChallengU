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
  pg.connect(conString, function (err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var queryText =  "SELECT categoryID FROM Category WHERE name = ";
    for(i  =0; i < categories.length; i++){
      if(i != 0) queryText += " OR name = ";
      queryText += ("'" + categories[i] + "'");
    }
    client.query(queryText, function(err, result){
      if(err) return console.error('error running query', err);
      var catIDs = result.rows;
      var tx = new Transaction(client);
      tx.begin();
      tx.query("INSERT INTO Challenge (userID, content, difficulty, target, type, targetUserID) VALUES ($1,$2,$3,$4,$5,$6) RETURNING challengeID",
      [1, desc, difficulty, 'community', type, 2], function(err, result){ //For testing, a challenge from user 1 to user 2
        if(err) return console.error('error', err);
        for(i = 0; i < catIDs.length; i++){
          tx.query("INSERT INTO ChallengeCategory (challengeID, categoryID) VALUES ($1, $2)", [result.rows[0].challengeID, catIDs[i]]);
        }
        tx.commit();
      });
    });

//Testar esta query, fiz tudo a 'olho'


  });
};
