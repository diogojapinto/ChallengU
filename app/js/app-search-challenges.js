(function () {
    var app = angular.module('search-challenges-app', []);

    /**
     * Controller to search for challenges
     */
    app.controller('ChallengeSearchController', ['$scope', '$http', 'Search', function ($scope, $http, Search) {
        $scope.formData = {};
        $scope.loading = true;

        $scope.searchChallenge = function () {
            $scope.loading = true;
            Search.search($scope.formData, $scope.loading);
        };

    }]);

    app.factory('Search', ['$http', '$window', function ($http, $window) {
        return{
            /**
             * Service for sending the new challenge info to the server
             * @param searchData user input search data
             */
            search: function (searchData, loading, challenges) {
                $window.location.href = '/search/' + searchData.searchValue;
            }
        }
    }]);
})();