var path = require('path');
var db = require('./database-requests.js');
exports.start = function (app) {

    //entry point

    app.get("/login", function (req, res) {
        res.sendfile(path.join(__dirname, '../html', 'login.html'));
    });

    app.get("/post-challenge", function (req, res) {
        res.sendfile(path.join(__dirname, '../html', 'challenge-submit.html'));
    });

    app.post("/get-categories", function (req, res) {
        db.getCategories(function (categories) {
            res.send(categories.rows);
        });
    });

    app.post("/login-user", function (req, res) {
        console.log(req.body);
        db.getUser(req.body.user.username,function (user) {
            console.log(user.rows[0].pass + " = " + req.body.user.password);
            console.log(user.rows[0].username + " = " + req.body.user.username);
            if (user.rows[0].pass === req.body.user.password && user.rows[0].username === req.body.user.username) {
                res.send("OK");
            } else {
                res.status(404).send("NOT OK");
            }
        });
    });

    app.post("/create-challenge", function(req, res){
    console.log('REQUEST = ' + req);
    });
    app.get('*', function (req, res) {
        res.sendfile(path.join(__dirname, '../../landing/html/landing.html'));
    });
};
