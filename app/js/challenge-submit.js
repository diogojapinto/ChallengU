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
        this.challengeCategories = []; //to replace
        $http.post("/get-categories").
            success(function (data, status, headers, config) {
                alert("ola");
            }).
            error(function (data, status, headers, config) {
                alert("fail");
            });

        this.challengeTypes = ['video', 'sound', 'text', 'photo'];
    }]);

})();
