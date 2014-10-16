(function () {
    var app = angular.module('challenge-submit', []);

    app.controller('ChallengeSubmit', [$http, function ($http) {
        //default values
        this.challenge = {
            name      : "",
            category  : [""],
            type      : "",
            difficulty: 3,
            description: ""
        };

        //get categories
        this.challengeCategories = ['funny', 'serious', 'dangerous']; //to replace
        $http.get("../server/getCategories").
            success(function (data, status, headers, config) {

            }).
            error(function (data, status, headers, config) {

            });

        this.challengeTypes = ['video', 'sound', 'text', 'photo'];
    });

})();
