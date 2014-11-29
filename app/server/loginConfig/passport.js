var facebookStrategy = require('passport-facebook').Strategy;
var auth = require('./auth');
var userDAO = require('../model/usersMdl');

module.exports = function(passport){

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        userDAO.getUserByID(id, function(err, user) {
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
                        console.log("FOUND IT");
                        req.session.regenerate(function () {
                            req.session.user = user.rows[0];
                        });
                        return done(null, user.rows[0].userid);
                    }else{//Not found, register in db
                        console.log("USER REGISTERING WITH MAIL = " + JSON.stringify(profile.emails[0]));
                        userDAO.registerUserFb(profile.id, token, profile.name.givenName + ' ' + profile.name.familyName, profile.emails[0].value, function(result){

                        });
                    }
                });
            });
        }
    ));
}