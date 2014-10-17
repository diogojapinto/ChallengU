(function() {
  var app = angular.module('login', []);

  app.controller('LoginController', function(){
    this.user = {};

    this.addUser = function (user) {
        alert(user.username);
    };

    this.resetForm = function() {
    	this.user = {};
    }
  });

})();