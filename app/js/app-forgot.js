(function(){
    var app = angular.module('forgot-app',[]);

    app.config(function($locationProvider){
        $locationProvider.html5Mode(true);
    })

    app.controller('forgotPasswordController', ['$scope', '$location','$http', '$window', 'Reset', function($scope,$location ,$http, $window, Reset){
        var slash = $location.path().lastIndexOf('/');
        var token = $location.path().substr(slash+1);
        $scope.sendReset = function(){
            if($scope.formData != undefined){
                Reset.send($scope.formData)
                    .success(function(data){
                        $scope.formData = {};
                        $window.location.href = '*';
                    })
                    .error(function(data){
                        alert("FAILED: " + data);
                    });
            }
        };

        $scope.reset = function($routeParams){
          if($scope.formData != undefined){
              if($scope.formData.password.length <= 6){
                  alert("Password length must be greater than 6!");
                  return
              } else if($scope.formData.password != $scope.formData.confirmPassword){
                  alert("Passwords must match");
                  return;
              } else{
                  $scope.formData.token = token;
                  Reset.reset($scope.formData)
                      .success(function(data){
                          $scope.formData = {};
                          $window.location.href = '/connect';
                      })
                      .error(function(data){

                      });
              }
          }
        };
    }]);

    app.factory('Reset', ['$http', function($http){
        return{
            send:function(user){
                return $http.post('/forgotPassword', user);
            },

            reset:function(data){
                return $http.post('/reset', data);
            }
        }
    }]);

})();