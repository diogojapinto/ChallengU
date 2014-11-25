var challengeDAO = require('../model/challengesMdl');
var userDAO = require('../model/usersMdl');

exports.getCategories = function (res) {

    var sendCurrentCategories = function (categories) {
        res.send(categories.rows);
    };

    challengeDAO.getCategories(sendCurrentCategories);
};

exports.insertChallenge = function (userid, data, res) {
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

    if (categories.length == 0) {
        res.status(400).send(false);
        return;
    }

    var getInsertedChallengeID = function (results) {

        if (!results) {
            res.status(400).send(false);
            return;
        }

        // index of challengeID query based on the number of queries made
        var challengeID = results[results.length - 1].rows[0].currval;

        if (challengeID) {
            console.log("ENTROU");
            res.status(200).send(challengeID.toString());
        } else {
            res.status(400).send(false);
        }
    };

    challengeDAO.insertChallenge(userid, name, difficulty, type, desc, categories, getInsertedChallengeID);
};

exports.getChallenge = function (challengeID, res, messages, globals) {

    var assembleChallenge = function (results) {

        if (!results) {
            res.render("landing.ejs", {messages: messages, globals: globals, title: 'Landing'});
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

        res.render('challenge.ejs', {
            title    : 'ChallengeU - Challenge ' + challenge.name,
            challenge: challenge,
            messages : messages,
            globals: globals
        });
    };

    challengeDAO.getChallenge(challengeID, assembleChallenge);
};

exports.searchChallenges = function (searchValue, res, messages) {

    var stars = [];

    var sendSearchResults = function (challenges) {

        if (!challenges) {
            res.status(400).send(false);
        } else {
            for (var i = 0; i < challenges.rows.length; i++) {
                var st = [];
                for (var j = 0; j < 5; j++) {
                    if (j < challenges.rows[i]['difficulty']) {
                        st.push(1);
                    } else {
                        st.push(0);
                    }
                }
                challenges.rows[i]['stars'] = st;
            }
            console.log(searchValue);
            if (challenges.rows.length <= 0) {

                res.status(400).render('search.ejs', {
                    title   : 'Search Results',
                    search  : challenges.rows,
                    messages: messages,
                    val     : searchValue
                });
            } else {

                res.status(200).render('search.ejs', {
                    title   : 'Search Results',
                    search  : challenges.rows,
                    messages: messages,
                    val     : searchValue
                });
            }
        }
    }

    challengeDAO.searchChallenge(searchValue, sendSearchResults);
};

exports.getChallengesHome = function (res, messages, globals) {

    var sendHomepage = function (challenges) {

        if (!challenges) {
            messages.warning.push({title: "No Challenges", content: "No challenges available"});
            challenges.rows = null;
        }
        res.render("home.ejs", {challenges: challenges.rows, messages: messages, globals: globals, title: 'Home'});
    };

    challengeDAO.getChallengesHome(sendHomepage);
};

/**
 * Insert a challenge proof
 * @param userID
 * @param data
 * @param res
 */
exports.insertChallengeProof = function (userID, data, res) {
    var challengeID = data.challengeID;
    var content = data.content;
    var getInsertedChallengeProofID = function (results) {

        if (!results) {
            res.status(404).send(false);
            return;
        }

        // index of challengeProofID query based on the number of queries made
        var challengeProofID = results[results.length - 1].rows[0].currval;

        if (challengeProofID) {
            res.status(200).send(challengeID.toString());
        } else {
            res.status(400).send(false);
        }
    };

    challengeDAO.insertChallengeProof(userID, challengeID, content, getInsertedChallengeProofID);
}