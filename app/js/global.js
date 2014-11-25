(function () {
    var app = angular.module('global-app', ['search-challenges-app', 'connect-app']);

    angular.element(document).ready(function () {
        angular.element('a[title]').tooltip();
    });
})();