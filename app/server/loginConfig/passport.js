var facebookStrategy = require('passport-facebook').Strategy;
var auth = require('./auth');
var userDAO = require('../model/usersMdl');

module.exports = function(passport){

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        userDAO.getUserByID(user.userid, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new facebookStrategy({
        clientID : auth.facebookAuth.clientID,
        clientSecret : auth.facebookAuth.clientSecret,
        callbackURL : auth.facebookAuth.callbackURL,
        passReqToCallback : true
    },

        function(req, token, refreshToken, profile, done){
            process.nextTick(function(){
                userDAO.getUserByFbId(profile.id, function(user){
                    if(user.rows[0] != undefined){ //Found, log the user
                        return done(null, user.rows[0]);
                    }else{//Not found, register in db
                        userDAO.registerUserFb(profile.id, token, profile.name.givenName + ' ' + profile.name.familyName, profile.emails[0].value, function(result){
                            return done(null, result.rows[0]);
                        });
                    }
                });
            });
        }
    ));
}