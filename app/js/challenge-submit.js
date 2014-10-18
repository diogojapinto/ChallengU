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
        this.challengeCategories = [];
        var categories = this.challengeCategories;
        $http.post("/get-categories").
            success(function (data, status, headers, config) {

                for (i = 0; i < data.length; i++) {
                    categories[i] = data[i].name;
                }
            }).
            error(function (data, status, headers, config) {
                alert("fail");
            });

        this.challengeTypes = ['video', 'sound', 'text', 'photo'];
    }]);

})();
