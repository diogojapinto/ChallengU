(function () {
    angular.element(document).ready(function () {
        angular.element('a[title]').tooltip();
    });

    angular.element(document).ready(function () {
        angular.element('.navbar-nav [data-toggle="tooltip"]').tooltip();
        angular.element('.navbar-twitch-toggle').on('click', function (event) {
            event.preventDefault();
            angular.element('.navbar-twitch').toggleClass('open');
        });

        angular.element('.nav-style-toggle').on('click', function (event) {
            event.preventDefault();
            var $current = $('.nav-style-toggle.disabled');
            angular.element(this).addClass('disabled');
            $current.removeClass('disabled');
            angular.element('.navbar-twitch').removeClass('navbar-' + $current.data('type'));
            angular.element('.navbar-twitch').addClass('navbar-' + $(this).data('type'));
        });
    });


    'use strict';

    document.querySelector('.material-design-hamburger__icon').addEventListener(
        'click',
        function () {
            var child;

            document.body.classList.toggle('background--blur');
            this.parentNode.nextElementSibling.classList.toggle('menu--on');

            child = this.childNodes[1].classList;

            if (child.contains('material-design-hamburger__icon--to-arrow')) {
                child.remove('material-design-hamburger__icon--to-arrow');
                child.add('material-design-hamburger__icon--from-arrow');
            } else {
                child.remove('material-design-hamburger__icon--from-arrow');
                child.add('material-design-hamburger__icon--to-arrow');
            }

        });
})();