(function () {
    var app = angular.module('challenge-submit', []);

    app.controller('ChallengeSubmit', function () {
        this.challenge = {
            name: "",
            category: [""],
            type: "",
            difficulty: 0,
            description: ""
        }

        this.categories = [funny, serious, dangerous];
        this.types = [video, sound, text, photo];
        this.difficulties = [1, 2, 3, 4, 5];

    });

});
