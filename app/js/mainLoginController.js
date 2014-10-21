var app = angular.module('login-main-controller', ['login','login-service']);

//creates the <navbar> element
app.directive('navbar',function(){
    return{
        restrict: 'E',
        templateUrl: 'navbar'
    }
} );