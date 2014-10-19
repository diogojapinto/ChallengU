(function() {
  var app = angular.module('login', []);

  app.controller('LoginController', ['$http', function ($http){
      /* Controller that manages the login of an user */
    this.user = {};

    this.addUser = function (user) {
        /* Submits the user information, in an attempt to login */
        //TODO: get new page
        $http.post("/login-user", {user: this.user}).
            success(function (data, status, headers, config) {
                alert(data);
            }).
            error(function (data, status, headers, config) {
                alert("fail");
            });
    };

    this.resetForm = function() {
        /* Cleans user input */
    	this.user = {};
    }
  }]);

})();