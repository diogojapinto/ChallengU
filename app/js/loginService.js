angular.module('login-service', [])

    .factory('Login', ['$http', function($http){
        return{
            create:function(user){
                alert(user.username);
                return $http.post('/login-user', user);
            }
        }
    }]);

