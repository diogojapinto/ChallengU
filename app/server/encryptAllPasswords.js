var db = require('./database-setup');
var passwordManager = require('./managePasswords');

exports.encryptAll = function(){
    db.query("SELECT pass FROM RegisteredUser", [], function(result){
        for(var i = 0; i < result.rows.length;i++ ){
            var oldPassword = result.rows[i].pass;
            passwordManager.cryptPassword(result.rows[i].pass, null, function(err, hash, oldPassword){
                db.query("UPDATE RegisteredUser SET pass=" + "'" + hash + "'" + " WHERE pass=" + "'" + oldPassword + "'", [], function(){

                });
            });
        }
    });
}