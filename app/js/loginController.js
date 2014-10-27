(function () {
    var app = angular.module('login', []);

    app.controller('LoginController', ['$scope', '$http', '$window', 'Login', function ($scope, $http, $window, Login) {
        /* Controller that manages the login of an user */

        $scope.formData = {};
        $scope.loading = true;
        $scope.text = null;
        $scope.show = false;

        $scope.login = function () {
            $scope.loading = true;
            if ($scope.formData != undefined) {
                Login.create($scope.formData)
                    .success(function (data) {
                        $scope.loading = false;
                        $scope.formData = {};
                        $scope.text = "GLORIOUS!";
                        $scope.show = true;
                        $window.location.href = '/';
                    })
                    .error(function (data) {
                        $scope.text = "DUMBBBBBBBBBBBBB";
                        $scope.show = true;
                        alert("failed: " + data);
                    });
            }
        };

        $scope.switchBool = function(value) {
            $scope[value] = !$scope[value];
        };

        $scope.resetForm = function () {
            /* Cleans user input */
            $scope.formData = {};
        }
    }]);

})();