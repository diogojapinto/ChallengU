var userDAO = require('../model/usersMdl');

exports.getUser = function (username, req, res) {

    var loginCallback = function (user) {
        user = user.rows[0];
        if (user && user.pass === req.body.password && user.username === req.body.username) {
            req.session.regenerate(function () {
                req.session.user = user;
                res.status(200).send("OK");
            });
        } else {
            res.status(404).send("NOT OK");
        }
    };

    userDAO.getUser(username, loginCallback);
};