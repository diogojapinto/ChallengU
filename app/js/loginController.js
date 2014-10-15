(function() {
  var app = angular.module('login', []);

  app.controller('LoginController', function(){
    this.user = {};

    this.addUser = function (user) {

    };

    this.resetForm = function() {
    	this.user = {};
    }
  });

})();