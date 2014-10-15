(function () {
    var app = angular.module('challenge-submit', []);

    app.controller('ChallengeSubmit', function () {
        this.challenge = {
            name: "",
            category: [""],
            type: "",
            difficulty: 3,
            description: ""
        }

        this.challengeCategories = ['funny', 'serious', 'dangerous'];
        this.challengeTypes = ['video', 'sound', 'text', 'photo'];
        this.challengeDifficulties = [1, 2, 3, 4, 5];

    });

})();
