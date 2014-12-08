(function () {
    var app = angular.module('register-app', []);

    /**
     * Controller that manages the register information of an user
     */
    app.controller('RegisterController', ['$scope', '$http', '$window', 'Register', function ($scope, $http, $window, Register) {
        /* Controller that manages the register of an user */

        $scope.formData = {};
        $scope.loading = true;

        $scope.register = function () {
            $scope.loading = true;
            if ($scope.formData != undefined) {
                if ($scope.formData.username.length <= 4 || $scope.formData.username.length > 15) {
                    alert("Username length must be greater than 4 and lower than 15!");
                    return;
                } else if ($scope.formData.password.length <= 6) {
                    alert("Password length must be greater than 6!");
                    return;
                } else if ($scope.formData.password != $scope.formData.confirmPassword) {
                    alert("Passwords must match!");
                    return;
                } else {
                    Register.create($scope.formData)
                        .success(function (data) {
                            $scope.loading = false;
                            $scope.formData = {};
                            $window.location.href = '/connect';
                        })
                        .error(function (data) {
                            alert("failed: " + data);
                        });
                }
            }
        };
    }]);

    $("input[type=password]").keyup(function() {
        var ucase = new RegExp("[A-Z]+");
        var lcase = new RegExp("[a-z]+");
        var num = new RegExp("[0-9]+");

        if ($("#password1").val().length >= 8) {
            $("#8char").removeClass("glyphicon-remove");
            $("#8char").addClass("glyphicon-ok");
            $("#8char").css("color", "#00A41E");
        } else {
            $("#8char").removeClass("glyphicon-ok");
            $("#8char").addClass("glyphicon-remove");
            $("#8char").css("color", "#FF0004");
        }

        if (ucase.test($("#password1").val())) {
            $("#ucase").removeClass("glyphicon-remove");
            $("#ucase").addClass("glyphicon-ok");
            $("#ucase").css("color", "#00A41E");
        } else {
            $("#ucase").removeClass("glyphicon-ok");
            $("#ucase").addClass("glyphicon-remove");
            $("#ucase").css("color", "#FF0004");
        }

        if (lcase.test($("#password1").val())) {
            $("#lcase").removeClass("glyphicon-remove");
            $("#lcase").addClass("glyphicon-ok");
            $("#lcase").css("color", "#00A41E");
        } else {
            $("#lcase").removeClass("glyphicon-ok");
            $("#lcase").addClass("glyphicon-remove");
            $("#lcase").css("color", "#FF0004");
        }

        if (num.test($("#password1").val())) {
            $("#num").removeClass("glyphicon-remove");
            $("#num").addClass("glyphicon-ok");
            $("#num").css("color", "#00A41E");
        } else {
            $("#num").removeClass("glyphicon-ok");
            $("#num").addClass("glyphicon-remove");
            $("#num").css("color", "#FF0004");
        }

        if ($("#password1").val() == $("#password2").val()) {
            $("#pwmatch").removeClass("glyphicon-remove");
            $("#pwmatch").addClass("glyphicon-ok");
            $("#pwmatch").css("color", "#00A41E");
        } else {
            $("#pwmatch").removeClass("glyphicon-ok");
            $("#pwmatch").addClass("glyphicon-remove");
            $("#pwmatch").css("color", "#FF0004");
        }
    });

    /**
     * Service that attempts to register with the provided information
     */
    app.factory('Register', ['$http', function($http){
        return{
            create:function(user){
                console.log(user);
                return $http.post('/register', user);
            }
        }
    }]);
})();
