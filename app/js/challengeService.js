angular.module('challenge-service', [])

  .factory('Challenges', ['$http', function($http){
    return{
      create:function(challengeData){
        alert("DIF = " + challengeData.difficulty);
        return $http.post('/create-challenge', challengeData);
      }
    }
  }]);
