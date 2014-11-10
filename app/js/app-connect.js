(function () {
    var app = angular.module('connect-app', ['login-app', 'register-app']);

    angular.element(document).ready(function() {
        console.log(angular.element('a[title]'));
        angular.element('a[title]').tooltip();
    });
});