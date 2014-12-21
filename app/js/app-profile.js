(function () {
    var app = angular.module('profile-app', ['search-app']);

    /**
     * Controller that manages the login information of an user
     */
    app.controller('ProfileController', ['$scope', '$http', '$window', 'Profile', function ($scope, $http, $window, Profile) {

        $scope.formData = {};
        $scope.loading = true;
        $scope.sent = false;
        $scope.buttonText = "Add Friend";

        $scope.addFriendRequest = function (username) {
            $scope.loading = true;
            Profile.requestFriend({username: username})
                .success(function () {
                    $scope.sent = true;
                    $scope.buttonText = "Friend Request Sent";
                })
                .error(function () {

                });
        };
    }]);

    /**
     * Service that attempts to login with provided information
     */
    app.factory('Profile', ['$http', function ($http) {
        return {
            requestFriend: function (username) {
                return $http.post('/add-friend', username);
            }
        }
    }]);
})();