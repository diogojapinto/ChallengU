(function () {
    var app = angular.module('login-app', []);

    /**
     * Controller that manages the login information of an user
     */
    app.controller('LoginController', ['$scope', '$http', '$window', 'Login', function ($scope, $http, $window, Login) {

        $scope.formData = {};
        $scope.loading = true;

        $scope.login = function () {
            $scope.loading = true;
            if ($scope.formData != undefined) {
                Login.create($scope.formData)
                    .success(function () {
                        $scope.loading = false;
                        $scope.formData = {};
                        $window.location.href = '/';
                    })
                    .error(function (data) {
                        // TODO: refactor redirect
                        alert("failed: " + data);
                    });
            }
        };
    }]);

    /**
     * Service that attempts to login with provided information
     */
    app.factory('Login', ['$http', function ($http) {
        return{
            create: function (user) {
                return $http.post('/login', user);
            }
        }
    }]);
})();