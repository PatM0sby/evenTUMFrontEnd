(function (angular) {
    "use strict";

    angular.module('Data', [])
        .service('DataService', DataService);

    DataService.$inject = ['$http', 'API', 'currUser', '$q'];


    function DataService ($http, api, currUser, $q) {
        function service (path) {

            var deferred = $q.defer();

            this.url = api + path;
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

            function getData() {
                var config = getAuth();

                $http.get(this.url, config)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function createData(data) {
                
                var config = getAuth();

                if (!data) {
                    deferred.reject('no data set');
                    return deferred.promise;
                }
                console.log (this.url, data, config);
                $http.post(this.url, data, config)
                    .success(function (response) {
                        console.log('save');
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function updateData(data) {
                var config = getAuth();

                if (!data) {
                    deferred.reject('no data to update');
                    return deferred.promise;
                }

                $http.put(this.url, data, config)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function deleteData(id) {
                var config = getAuth(),
                    url = id ? this.url + '/' + id : this.url;

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