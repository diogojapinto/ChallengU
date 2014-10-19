angular.module('challenge-service', [])

    .factory('Challenges', ['$http', function ($http) {
        return{
            create       : function (challengeData) {
                $http.post('/create-challenge', challengeData)
                    .success(function (data) {
                        $scope.loading = false;
                        $scope.formData = {};
                    })
                    .error(function (data) {
                        alert("failed: " + data);
                    });
            },
            getCategories: function (categories) {
                $http.post("/get-categories")
                    .success(function (data, status, headers, config) {
                        for (i = 0; i < data.length; i++) {
                            categories[i] = data[i].name;
                        }
                    }).
                    error(function (data, status, headers, config) {
                        alert("failed: " + data);
                    });
            }
        }
    }]);
