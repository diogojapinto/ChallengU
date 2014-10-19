(function () {
    var app = angular.module('login', []);

    app.controller('LoginController', ['$scope', '$http', 'Login', function ($scope, $http, Login) {
        /* Controller that manages the login of an user */
        this.user = {};
        $scope.formData = {};
        $scope.loading = true;

        $scope.login = function () {
            alert("Ola");
            $scope.loading = true;
            if ($scope.formData != undefined) {
                Login.create($scope.formData)
                    .success(function (data) {
                        $scope.loading = false;
                        $scope.formData = {};
                        alert("success");
                    })
                    .error(function (data) {
                        alert("failed: " + data);
                    });
            }
        };

        /*this.addUser = function (user) {
         /* Submits the user information, in an attempt to login
         //TODO: get new page
         $http.post("/login-user", {user: this.user}).
         success(function (data, status, headers, config) {
         alert(data);
         }).
         error(function (data, status, headers, config) {
         alert("fail");
         });
         };*/

        $scope.resetForm = function () {
            /* Cleans user input */
            $scope.formData = {};
        }
    }]);

})();