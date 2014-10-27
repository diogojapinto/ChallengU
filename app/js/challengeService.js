angular.module('challenge-service', [])

    .factory('Challenges', ['$http', '$window', function ($http, $window) {
        return{
            create: function (challengeData) {
                $http.post('/create-challenge', challengeData)
                    .success(function (data, loading) {
                        loading = false;
                        if (data) {
                            $window.location.href = '/challenge/' + data;
                        }
                        data = {};

                    })
                    .error(function (data) {
                        alert("failed: " + data);
                    });
            },
            getCategories: function (categories) {
                $http.post("/get-categories")
                    .success(function (data, status, headers, config) {
                        for (i = 0; i < data.length; i++) {
                            categories[i] = {'name': data[i].name, 'categoryid': data[i].categoryid};
                        }
                    }).
                    error(function (data, status, headers, config) {
                        alert("failed: " + data);
                    });
            }
        }
    }]);
