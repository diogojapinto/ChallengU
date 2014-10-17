(function () {
    var app = angular.module('challenge-submit', []);

    app.controller('ChallengeSubmit', ['$http', function ($http) {
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
        $http.post("../server/app").
            success(function (data, status, headers, config) {
                alert("ola");
            }).
            error(function (data, status, headers, config) {

            });

        this.challengeTypes = ['video', 'sound', 'text', 'photo'];
    }]);

})();
