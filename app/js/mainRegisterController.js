var app = angular.module('register-main-controller', ['register','register-service']);

//creates the <navbar> element
app.directive('navbar',function(){
    return{
        restrict: 'E',
        templateUrl: 'navbar'
    }
} );
