(function () {
  var app = angular.module('challenge-submit', []);

  app.controller('ChallengeSubmit', ['$scope','$http', 'Challenges',function ($scope,$http,Challenges) {

    $scope.formData = {};
    $scope.loading = true;


    $scope.createChallenge = function(){
      $scope.loading = true;
      if($scope.formData != undefined){
        Challenges.create($scope.formData)
        .success(function(data){
          $scope.loading = false;
          $scope.formData = {};
          alert("success");
        })
        .error(function(data){
          alert("failed: " + data);
        });
      }
    };
    this.challenge = {
      name      : "",
      category  : [""],
      type      : "",
      difficulty: 3,
      description: ""
    };

    //get categories
    this.challengeCategories = [];
    var categories = this.challengeCategories;
    $http.post("/get-categories").
    success(function (data, status, headers, config) {

      for (i = 0; i < data.length; i++) {
        categories[i] = data[i].name;
      }
    }).
    error(function (data, status, headers, config) {
      alert("fail");
    });

    this.challengeTypes = ['video', 'sound', 'text', 'photo'];
  }]);

})();
