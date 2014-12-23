(function () {
    var app = angular.module('challenge-app', ['search-app', 'ngTagsInput']);

    /**
     * Controller for challenge submitting
     */
    app.controller('ChallengeSubmit', ['$scope', '$http', 'Challenges', function ($scope, $http, Challenges) {

        $scope.formData = {
            name       : "",
            tags   : [],
            correspondencies : [],
            type      : 'video',
            difficulty: "3",
            description: ""};
        $scope.loading = true;

        $scope.createChallenge = function () {
            $scope.loading = true;
            if ($scope.formData.name != "" && $scope.formData.tags.length >= 1) {
                Challenges.create($scope.formData, $scope.loading);
            }
        };




        this.challengeTypes = ['audio', 'text', 'photo', 'video'];

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

        $scope.getCategories = function (query) {
            return $http.get("/get-categories");
        };
    }]);

    app.factory('Challenges', ['$http', '$window', function ($http, $window) {
        return{
            /**
             * Service for sending the new challenge info to the server
             * @param challengeData user input data of challenge
             */
            create: function (challengeData) {
                $http.get("/get-categories").
                    success(function(data, status, headers, config){
                        for(var i = 0; i < data.length; i++){
                            for(var j = 0; j < challengeData.tags.length; j++){
                                console.log(data[i].text + " VS " + challengeData.tags[j].text);
                                if(data[i].text == challengeData.tags[j].text){
                                    challengeData.correspondencies.push(i+1);
                                }
                            }
                        }

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
                                $window.location.href = '/post-challenge/error-challenge';
                            });
                    });


            }
        }
    }]);
})();