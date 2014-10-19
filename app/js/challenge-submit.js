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
            if ($scope.formData.name != "" && $scope.formData.category.length >= 1) {
                Challenges.create($scope.formData)
            }
        };

        //get categories
        this.challengeCategories = [];
        Challenges.getCategories(this.challengeCategories);

        this.challengeTypes = ['sound', 'text', 'photo', 'video'];

        // toggle selection for a given fruit by name
        $scope.toggleSelection = function toggleSelection(category) {
            var idx = $scope.formData.category.indexOf(category);

            // is currently selected
            if (idx > -1) {
                $scope.formData.category.splice(idx, 1);
            }

            // is newly selected
            else {
                $scope.formData.category.push(category);
            }
        };
    }]);

})();
