(function () {
    var app = angular.module('connect-app', ['login-app', 'register-app']);

    angular.element(document).ready(function() {
        angular.element('a[title]').tooltip();
    });
})();