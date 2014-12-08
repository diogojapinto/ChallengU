(function () {
    var app = angular.module('search-app', []);

    /**
     * Controller to search for challenges
     */
    app.controller('SearchController', ['$scope', '$http', 'Search', function ($scope, $http, Search) {
        $scope.formData = {};
        $scope.loading = true;

        $scope.searchThings = function () {
            console.log("search pressed");
            $scope.loading = true;
            Search.searchAll($scope.formData, $scope.loading);
        };
    }]);

    /**
     * Service for searching for users and challenges
     * @param searchData user input search data
     */
    app.factory('Search', ['$http', '$window', function ($http, $window) {
        return{
            searchAll: function (searchData, loading) {
                console.log(searchData);
                $window.location.href = '/search/' + searchData.searchValue;
            }
        }
    }]);
})();