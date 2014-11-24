(function () {
    document.querySelector('.material-design-hamburger__icon').addEventListener(
        'click',
        function () {
            var child;

            angular.element('.menu').toggleClass('menu--on');

            if (angular.element(window).width() >= 768) {
                angular.element('.menu span').fadeToggle();
            }

            child = this.childNodes[1].classList;

            if (child.contains('material-design-hamburger__icon--to-arrow')) {
                child.remove('material-design-hamburger__icon--to-arrow');
                child.add('material-design-hamburger__icon--from-arrow');
            } else {
                child.remove('material-design-hamburger__icon--from-arrow');
                child.add('material-design-hamburger__icon--to-arrow');
            }
        });

    angular.element(".dropdown").hover(
        function () {
            angular.element('.dropdown-menu', this).stop(true, true).fadeIn("fast");
            angular.element(this).toggleClass('open');
            angular.element('b', this).toggleClass("caret caret-up");
        },
        function () {
            angular.element('.dropdown-menu', this).stop(true, true).fadeOut("fast");
            angular.element(this).toggleClass('open');
            angular.element('b', this).toggleClass("caret caret-up");
        });
})();