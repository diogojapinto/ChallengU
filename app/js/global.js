(function () {
    angular.element(document).ready(function() {
        angular.element('a[title]').tooltip();
    });

    angular.element(document).ready(function() {
        angular.element('.navbar-nav [data-toggle="tooltip"]').tooltip();
        angular.element('.navbar-twitch-toggle').on('click', function(event) {
            event.preventDefault();
            angular.element('.navbar-twitch').toggleClass('open');
        });

        angular.element('.nav-style-toggle').on('click', function(event) {
            event.preventDefault();
            var $current = $('.nav-style-toggle.disabled');
            angular.element(this).addClass('disabled');
            $current.removeClass('disabled');
            angular.element('.navbar-twitch').removeClass('navbar-'+$current.data('type'));
            angular.element('.navbar-twitch').addClass('navbar-'+$(this).data('type'));
        });
    });

})();