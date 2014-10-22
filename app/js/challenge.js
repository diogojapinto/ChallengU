(function() {
    var app = angular.module('challenge', []);

    var rating = angular.element('#challenge-rating');
    var ratingVal = parseFloat(rating.val());
    rating.rating();
    rating.rating('update', ratingVal);
})();

var starCaptions = function(val) {
    if(val > 4) {
        return 'Epic challenge';
    } else if (val > 3) {
        return 'Great'
    } else if (val > 2) {
        return 'Generic challenge'
    } else if (val > 1) {
        return 'Try-hard Challenge'
    } else {
        return 'Buhhh Challenge';
    }
};