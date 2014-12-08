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

        $scope.addFriend = function (userid) {
            $scope.loading = true;
            Profile.requestFriend({userid: userid})
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
            requestFriend: function (userid) {
                return $http.post('/add-friend', userid);
            }
        }
    }]);
})();