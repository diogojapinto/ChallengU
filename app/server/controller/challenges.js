var challengeDAO = require('../model/challenges')


exports.getCategories = function (callback) {
    return challengeDAO.getCategories;
};

exports.insertChallenge = function (data, callback) {
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

    challengeDAO.insertChallenge(name, difficulty, type, desc, categories, callback);
};

exports.getChallenge = function(challengeID) {
    var assembleChallenge = function(results) {

        if (!results) {
            return null;
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
        results[1].rows.forEach(function(category) {
            challenge.category.push(category);
        });

        // rating
        challenge.rating = parseFloat(results[2].rows[0].avg);

        // comments
        challenge.comments = [];
        results[3].rows.forEach(function(entry) {
            challenge.comments.push(entry);
        });

        // challenge proofs
        challenge.responses = [];
        results[4].rows.forEach(function(proof) {
            proof.rating = parseInt(proof.rating);
            challenge.responses.push(proof);
        });
    };

    challengeDAO.getChallenge(challengeID, assembleChallenge);
};