(function () {
    var app = angular.module('login-app', []);

    /**
     * Controller that manages the login information of an user
     */
    app.controller('LoginController', ['$scope', '$http', '$window', 'Login', function ($scope, $http, $window, Login) {

        $scope.formData = {};
        $scope.loading = true;
        $scope.text = null;
        $scope.show = false;

        $scope.login = function () {
            $scope.loading = true;
            if ($scope.formData != undefined) {
                Login.create($scope.formData)
                    .success(function () {
                        $scope.loading = false;
                        $scope.formData = {};
                        $scope.text = "GLORIOUS!";
                        $scope.show = true;
                        $window.location.href = '/';
                    })
                    .error(function (data) {
                        // TODO: refactor redirect
                        $scope.text = "DUMBBBBBBBBBBBBB";
                        $scope.show = true;
                        alert("failed: " + data);
                    });
            }
        };

        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };

        $scope.resetForm = function () {
            /* Cleans user input */
            $scope.formData = {};
        }
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