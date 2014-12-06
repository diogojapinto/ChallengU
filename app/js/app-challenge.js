(function() {
    var app = angular.module('app-challenge', ['search-challenges-app']);

    app.controller('ProofSubmit', ['$scope', '$http', 'Proof', function ($scope, $http, Proof) {
        $scope.postChallengeProof = function () {
            $scope.loading = true;
            if ($scope.formData.content != "") {
                Proof.create($scope.formData, $scope.loading);
            }
        };
    }]);

    app.factory('Proof', ['$http', '$window', function ($http, $window) {
        return{
            /**
             * Service for sending the new challenge proof info to the server
             * @param proofData user input data of challenge proof
             */
            create: function (proofData) {
                $http.post('/create-challenge-response', proofData)
                    .success(function (data, loading) {
                        loading = false;
                        if (data) {
                            // redirects to the responded challenge's page
                            $window.location.href = '/challenge/' + data;
                        }
                        data = {};

                    })
                    .error(function (data) { //TODO error page for this
                        $window.location.href = '/post-challenge/error-challenge';
                    });
            }
        }
    }]);
})();