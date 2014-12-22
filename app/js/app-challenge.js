(function () {
    var app = angular.module('app-challenge', ['search-app']);

    app.controller('ProofSubmit', ['$scope', '$http', 'Proof', 'Rater', function ($scope, $http, Proof) {

        $scope.postImage = function () {

            var image = $("#image")[0].files[0];

            if (!image || !image.type.match(/image.*/)) return;

            // It is!
            // Let's build a FormData object

            var fd = new FormData();
            fd.append("image", image); // Append the file
            //fd.append("key", "6528448c258cff474ca9701c5bab6927");
            // Get your own key: http://api.imgur.com/

            // Create the XHR (Cross-Domain XHR FTW!!!)
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api.imgur.com/3/image"); // Boooom!
            xhr.setRequestHeader('Authorization', 'Client-ID f91062d2d7ea3e0');
            xhr.onload = function (data) {
                // Big win!
                // The URL of the image is:
                var json = JSON.parse(data.currentTarget.response);
                $scope.formData.content = json.data.link;
                if ($scope.formData.content != "") {
                    Proof.create($scope.formData, $scope.loading);
                }
            }
            // Ok, I don't handle the errors. An exercice for the reader.
            // And now, we send the formdata
            xhr.send(fd);
        };

        $scope.postChallengeProof = function (type) {
            $scope.loading = true;

            if (type == "photo") {
                $scope.postImage();
            } else if (type == "text") {
                if ($scope.formData.content != "") {
                    Proof.create($scope.formData, $scope.loading);
                }
            } else if (type == "video") {
                console.log("cenas");
            }

        };
    }]);

    app.controller('RatingController', ['$scope', '$http', 'Rater', function ($scope, $http, Rater) {
        $scope.rateChallenge = function () {
            Rater.rateChallenge($scope.challengeID, $scope.rating);
        };
        $scope.rateChallengeProof = function(proofID) {
            Rater.rateChallengeProof(proofID, $scope.proofRating);
        }
    }]);

    app.controller('CommentController', ['$scope', '$http', function ($scope, $http) {
        $scope.content = "";
        $scope.addComment = function (user, challengeid) {
            $http.post('/add-comment', {username: user, content: $scope.content, challengeid: challengeid})
                .success(function (data) {
                    angular.element("#comments").prepend('<li class="list-group-item"> <div class="row"> <div class="col-xs-2 col-md-1"> <img src="http://placehold.it/80" class="img-circle img-responsive" alt=""/></div> <div class="col-xs-10 col-md-11"> <div> <div class="mic-info">By: <a href="/profile/' + user + '"> ' + user + ' </a> </div> </div> <div class="comment-text"> ' + $scope.content + '</div> </div> </div> </li>');
                })
                .error(function (data) {
                    console.log("error");
                });
        };
    }]);

    app.factory('Proof', ['$http', '$window', function ($http, $window) {
        return {
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
        return {
            rateChallenge: function (challenge, rating) {
                return $http.post('/challenge-rating/', {challenge: challenge, rating: rating});
            },
            rateChallengeProof: function(challengeProof, rating) {
                return $http.post('/challenge-proof-rating/', {proof: challengeProof, rating: rating});
            }
        }
    }]);
})();