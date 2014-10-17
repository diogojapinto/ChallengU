(function() {
  var app = angular.module('login', []);

  app.controller('LoginController', function(){
      /* Controller that manages the login of an user */
    this.user = {};

    this.addUser = function (user) {
        /* Submits the user information, in an attempt to login */
        //TODO: get new page
        alert(user.username);
    };

    this.resetForm = function() {
        /* Cleans user input */
    	this.user = {};
    }
  });

})();