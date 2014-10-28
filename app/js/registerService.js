angular.module('register-service', [])

    .factory('Register', ['$http', function($http){
        return{
            create:function(user){
                return $http.post('/register-user', user);
            }
        }
    }]);


