(function () {
    var app = angular.module('search-challenges-app', []);

    /**
     * Controller to search for challenges
     */
    app.controller('ChallengeSearchController', ['$scope', '$http', 'Search', function ($scope, $http, Search) {
        $scope.formData = {};
        $scope.loading = true;
        this.challenges;

        $scope.searchChallenge = function () {
            $scope.loading = true;
            this.challenges = [];
            Search.search($scope.formData, $scope.loading, this.challenges);
        };

    }]);

    app.factory('Search', ['$http', '$window', function ($http, $window) {
        return{
            /**
             * Service for sending the new challenge info to the server
             * @param searchData user input search data
             */
            search: function (searchData, loading, challenges) {
                $http.post('/search-challenge', searchData)
                    .success(function (data) {
                        loading = false;
                        if (data) {
                            // redirects to a page that contains the results
                            alert(data);
                            console.log(data[0]);
                            for (var i = 0; i < data.length; i++) {
                                challenges.push( {'id': data[i].id, 'name': data[i].name, 'userID': data[i].userid, 'content': data[i].content, 'difficulty': data[i].difficulty, 'target': data[i].target, 'type': data[i].type, 'targetUserID': data[i].targetuserid});
                            }
                            console.log(challenges);
                            //$window.location.href = '/challenge/' + data;
                        }
                        data = {};

                    })
                    .error(function (data) {
                        // TODO: refactor -> redirect instead of javascript alert
                        alert("failed: " + data);
                    });
            }
        }
    }]);
})();