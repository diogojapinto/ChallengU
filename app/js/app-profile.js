(function () {
    var app = angular.module('profile-app', []);

    /**
     * Controller that manages the login information of an user
     */
    app.controller('ProfileController', ['$scope', '$http', '$window', 'Profile', function ($scope, $http, $window, Profile) {

        $scope.formData = {};
        $scope.loading = true;

        $scope.addFriend = function (userid) {
            $scope.loading = true;

            addFriend(userid);
        };
    }]);

    /**
     * Service that attempts to login with provided information
     */
    app.factory('Profile', ['$http', function ($http) {
        return{
            addFriend: function (userid) {
                return $http.post('/add-friend', userid);
            }
        }
    }]);
})();