(function () {
    var app = angular.module('edit-profile-app', []);

    /**
     * Controller that manages the login information of an user
     */
    app.controller('editProfileController', ['$scope', '$http', '$window', 'Edit', function ($scope, $http, $window, Edit) {

        $scope.formData = {};
        $scope.loading = true;
        $scope.pass = false;

        var id = angular.element($('input[name=id]')).val();

        Edit.getUser(id,$scope.formData);


        $scope.editProfile = function () {
            $scope.loading = true;
            if ($scope.formData != undefined) {
                if ($scope.pass) {
                    if ($scope.formData.oldPassword == null || $scope.formData.newPassword == null || $scope.formData.confirmPassword == null) {
                        alert("Password fields empty!");
                        return;
                    }else if ($scope.formData.newPassword.length <= 6 || $scope.formData.confirmPassword.length <= 6 || $scope.formData.oldPassword.length <= 6) {
                        alert("Password length must be greater than 6!");
                        return;
                    } else if ($scope.formData.newPassword != $scope.formData.confirmPassword) {
                        alert("New passwords must match!");
                        return;
                    } else if ($scope.formData.oldPassword === $scope.formData.newPassword || $scope.formData.oldPassword === $scope.formData.confirmPassword) {
                        alert("New password must be different from the previous!");
                        return;
                    }else {
                        Edit.edit($scope.formData, $scope.pass)
                            .success(function () {
                                $scope.loading = false;
                                $scope.formData = {};
                                $window.location.href = '/profile';
                            })
                            .error(function (data) {
                                $window.location.href = '/connect/error-login';
                            });
                    }
                }else {
                    if ($scope.formData.username.length <= 4 || $scope.formData.username.length > 15) {
                        alert("Username length must be greater than 4 and lower than 15!");
                        return;
                    } else {
                        Edit.edit($scope.formData, $scope.pass)
                            .success(function () {
                                $scope.loading = false;
                                $scope.formData = {};
                                $window.location.href = '/profile';
                            })
                            .error(function (data) {
                                $window.location.href = '/connect/error-login';
                            });
                    }
                }
            }
        };
    }]);

    /**
     * Service that attempts to login with provided information
     */
    app.factory('Edit', ['$http', function ($http) {
        return{
            edit: function (user, pass) {
                return $http.post('/edit-profile', {user: user, pass: pass});
            },
            getUser: function (userID, formData) {
                $http.post("/get-user/"+userID)
                    .success(function (data, status, headers, config) {
                        formData['id'] = data['userid'];
                        formData['username'] = data['username'];
                        var name = data['name'].split(" ",2);
                        formData['firstName'] = name[0];
                        formData['lastName'] = name[1];
                        formData['email'] = data['email'];
                        formData['work'] = data['work'];
                        formData['hometown'] = data['hometown'];
                    }).
                    error(function (data, status, headers, config) {
                        alert("failed: " + data);
                    });
            }
        }
    }]);
})();