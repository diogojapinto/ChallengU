var challengeDAO = require('../model/challengesMdl');
var userDAO = require('../model/usersMdl');

exports.getCategories = function (res) {

    var sendCurrentCategories = function (categories) {
        res.send(categories.rows);
    };

    challengeDAO.getCategories(sendCurrentCategories);
};

exports.insertChallenge = function (data, res) {
    var name = data.name;
    var difficulty = data.difficulty;
    var type = data.type;
    var desc;
    if (data.description != "" && data.description != undefined) {
        desc = data.description;
    } else {
        desc = "";
    }

    var categories = [];
    for (var i = 0; i < data.category.length; i++) {
        categories[i] = data.category[i];
    }

    var getInsertedChallengeID = function (results) {

        if (!results) {
            res.status(404).send(false);
            return;
        }

        // index of challengeID query based on the number of queries made
        var challengeID = results[results.length - 1].rows[0].currval;

        if (challengeID) {
            res.status(200).send(challengeID.toString());
        } else {
            res.status(400).send(false);
        }
    };

    challengeDAO.insertChallenge(name, difficulty, type, desc, categories, getInsertedChallengeID);
};

exports.getChallenge = function (challengeID, res) {

    var assembleChallenge = function (results) {

        if (!results) {
            res.sendfile(path.join(__dirname, '../views/landing.ejs')); //TODO FIX
            return;
        }

        var challenge = {};
        challenge.id = challengeID;

        // basic info
        challenge.name = results[0].rows[0].name;
        challenge.creator = results[0].rows[0].username;
        challenge.description = results[0].rows[0].content;
        challenge.difficulty = parseInt(results[0].rows[0].difficulty);
        challenge.target = results[0].rows[0].target;
        challenge.type = results[0].rows[0].type;

        // categories
        challenge.category = [];
        results[1].rows.forEach(function (category) {
            challenge.category.push(category);
        });

        // rating
        challenge.rating = parseFloat(results[2].rows[0].avg);

        // comments
        challenge.comments = [];
        results[3].rows.forEach(function (entry) {
            challenge.comments.push(entry);
        });

        // challenge proofs
        challenge.responses = [];
        results[4].rows.forEach(function (proof) {
            proof.rating = parseInt(proof.rating);
            challenge.responses.push(proof);
        });

        res.render('challenge.ejs', {title: 'ChallengeU - Challenge ' + challenge.name, challenge: challenge});
    };

    challengeDAO.getChallenge(challengeID, assembleChallenge);
};

exports.searchChallenges = function (searchValue, res) {

    var users = [];
    var i = 0;
    chal = [];
    chalz = [];

    var sendSearchResults = function (challenges) {

        if (!challenges) {
            res.status(400).send(false);
        } else {
            chal = challenges.rows;
            for (i; i < challenges.rows.length; i++) {
                if (i < challenges.rows.length - 1) {
                    userDAO.getUserByID(challenges.rows[i].userid, getUser);
                } else {
                    userDAO.getUserByID(challenges.rows[i].userid, getLastUser);
                }
            }
        }
    };

    var getUser = function (user) {
        users.push({username: user.rows[0].username});
    };

    var getLastUser = function (user) {
        users.push({username: user.rows[0].username});
        for (var j = 0; j < i; j++) {
            chalz.push({challenge: chal[j], user: users[j]});
        }
        console.log(chalz);
        res.render('search.ejs', {title: 'Search Results', search: chalz});
    }

    challengeDAO.searchChallenge(searchValue, sendSearchResults);
};