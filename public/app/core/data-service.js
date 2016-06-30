(function (angular) {
    "use strict";

    angular.module('Data', [])
        .service('DataService', DataService);

    DataService.$inject = ['$http', 'API', 'currUser', '$q'];


    function DataService ($http, api, currUser, $q) {
        function service () {

            var deferred = $q.defer();

            this.get = getData;
            this.create = createData;
            this.update = updateData;
            this.delete = deleteData;

            var getAuth = function () {
                var token = currUser.getToken();

                if (token) {
                    return {
                        headers: {
                            'Authorization': 'JWT ' + token
                        }
                    };
                }

                return {};
            };

            function getData(path) {
                var config = getAuth(),
                    url = api + path;

                $http.get(url, config)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function createData(path, data) {
                var config = getAuth(),
                    url = api + path;

                if (!data) {
                    deferred.reject('no data set');
                    return deferred.promise;
                }

                $http.post(url, data, config)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function updateData(path, data) {
                var config = getAuth(),
                    url = api + path;

                if (!data) {
                    deferred.reject('no data to update');
                    return deferred.promise;
                }

                $http.put(url, data, config)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function deleteData(path) {
                var config = getAuth(),
                    url = api + path;

                $http.delete(url, config)
                    .success(function (response) {
                        //delete answer returns remaining events
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        }

        return service;
    }

})(angular);