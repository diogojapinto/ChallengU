(function() {
    var app = angular.module('app-challenge', ['search-app']);

    app.controller('ProofSubmit', ['$scope', '$http', 'Proof', 'Rater', function ($scope, $http, Proof) {
        $scope.postChallengeProof = function () {
            $scope.loading = true;
            if ($scope.formData.content != "") {
                Proof.create($scope.formData, $scope.loading);
            }
        };
    }]);

    app.controller('RatingController', ['$scope', '$http', 'Rater', function ($scope, $http, Rater) {
        $scope.rateChallenge = function() {
            Rater.rateChallenge($scope.challengeID, $scope.rating);
        }
    }]);

    app.controller('CommentController', ['$scope', '$http', function($scope, $http) {
        $scope.content = "";
        $scope.addComment = function(user, challengeid) {
            console.log(user);
            $http.post('/add-comment', {user: user, content: $scope.content, challengeid: challengeid})
                .success(function(data) {
                    angular.element("#comments").prepend('<li class="list-group-item"> <div class="row"> <div class="col-xs-2 col-md-1"> <img src="http://placehold.it/80" class="img-circle img-responsive" alt=""/></div> <div class="col-xs-10 col-md-11"> <div> <div class="mic-info">By: <a href="/profile/' + user + '"> ' + user + ' </a> </div> </div> <div class="comment-text"> ' + $scope.content + '%> </div> </div> </div> </li>');
                })
                .error(function(data) {
                    console.log("error");
                });
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
    app.factory('Rater', ['$http', '$window', function ($http) {
        return{
            rateChallenge: function (challenge, rating) {
                return $http.post('/challenge-rating/', {challenge: challenge, rating: rating});
            }
        }
    }]);
})();