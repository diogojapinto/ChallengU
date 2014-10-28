(function () {
    var app = angular.module('challenge-service', []);

    /**
     * Controller for challenge submitting
     */
    app.controller('ChallengeSubmit', ['$scope', '$http', 'Challenges', function ($scope, $http, Challenges) {

        $scope.formData = {
            name       : "",
            category   : [],
            type      : 'video',
            difficulty: "3",
            description: ""};
        $scope.loading = true;

        $scope.createChallenge = function () {
            $scope.loading = true;
            if ($scope.formData.name != "" && $scope.formData.category.length >= 1) {
                Challenges.create($scope.formData, $scope.loading);
            }
        };

        //get categories
        this.challengeCategories = [];
        Challenges.getCategories(this.challengeCategories);

        this.challengeTypes = ['sound', 'text', 'photo', 'video'];

        $scope.toggleSelection = function toggleSelection(category) {
            var idx = $scope.formData.category.indexOf(category);

            // is currently selected
            if (idx > -1) {
                $scope.formData.category.splice(idx, 1);
            }

            // is newly selected
            else {
                $scope.formData.category.push(category);
            }
        };
    }]);

    app.factory('Challenges', ['$http', '$window', function ($http, $window) {
        return{
            /**
             * Service for sending the new challenge info to the server
             * @param challengeData user input data of challenge
             */
            create: function (challengeData) {
                $http.post('/create-challenge', challengeData)
                    .success(function (data, loading) {
                        loading = false;
                        if (data) {
                            // redirects to the created challenge's page
                            $window.location.href = '/challenge/' + data;
                        }
                        data = {};

                    })
                    .error(function (data) {
                        // TODO: refactor -> redirect instead of javascript alert
                        alert("failed: " + data);
                    });
            },
            /**
             * Retrieves the current categories present in the database
             * @param categories array to be filled with the currently existing categories
             */
            getCategories: function (categories) {
                $http.post("/get-categories")
                    .success(function (data, status, headers, config) {
                        for (i = 0; i < data.length; i++) {
                            categories[i] = {'name': data[i].name, 'categoryid': data[i].categoryid};
                        }
                    }).
                    error(function (data, status, headers, config) {
                        alert("failed: " + data);
                    });
            }
        }
    }]);
})();