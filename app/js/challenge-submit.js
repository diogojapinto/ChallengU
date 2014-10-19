(function () {
    var app = angular.module('challenge-submit', []);

    app.controller('ChallengeSubmit', ['$scope', '$http', 'Challenges', function ($scope, $http, Challenges) {

        $scope.formData = {
            name       : "",
            category   : [],
            type      : 'video',
            difficulty: "3",
            description: ""};
        $scope.loading = true;

        $scope.createChallenge = function () {
            $scope.loading = true;
            console.log($scope.formData);
            if ($scope.formData.name != "" && $scope.formData.category.length >= 1) {
                alert("create");
                Challenges.create($scope.formData)
            }
        };

        //get categories
        $scope.formData.challengeCategories = [];
        Challenges.getCategories($scope.formData.challengeCategories);

        this.challengeTypes = ['sound', 'text', 'photo', 'video'];
    }]);

})();
