var app = angular.module('main-controller', ['challenge-submit','challenge-service']);

//creates the <navbar> element
app.directive('navbar',function(){
    return{
        restrict: 'E',
        templateUrl: 'navbar'
    }
} );