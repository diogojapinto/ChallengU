angular.module('login-service', [])

    .factory('Login', ['$http', function($http){
        return{
            create:function(user){
                return $http.post('/login-user', user);
            }
        }
    }]);

