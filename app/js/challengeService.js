angular.module('challenge-service', [])

  .controller('ChallengeService', ['$scope', '$http', 'Challenges'], function($scope, $http, Challenges){
    $scope.formData = {};
    $scope.loading = true;

    $scope.createChallenge = function(){
      $scope.loading = true;

      if($scope.formData.text != undefined){
        $http.post('/create-challenge', $scope.formData)
          .success(function(data){
            $scope.loading = false;
            $scope.formData = {};
            alert("success");
          }),
          .error(function(data){
            alert("failed");
          });
      }
    };
  });
