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

            var successCallback = function (res) {
                //console.log(res);
                deferred.resolve(res.data);
            };

            var errorCallback = function (err) {
                deferred.reject(err);
            };

            function getData() {
                var config = getAuth();

                $http.get(this.url, config)
                    .then(successCallback, errorCallback);

                return deferred.promise;
            }

            function createData(data) {
                
                var config = getAuth();

                if (!data) {
                    deferred.reject('no data set');
                    return deferred.promise;
                }

                $http.post(this.url, data, config)
                    .then(successCallback, errorCallback);

                return deferred.promise;
            }

            function updateData(data) {
                var config = getAuth();

                if (!data) {
                    deferred.reject('no data to update');
                    return deferred.promise;
                }

                $http.put(this.url, data, config)
                    .then(successCallback, errorCallback);

                return deferred.promise;
            }

            function deleteData(id) {
                var config = getAuth(),
                    url = id ? this.url + '/' + id : this.url;

                $http.delete(url, config)
                    .then(successCallback, errorCallback);

                return deferred.promise;
            }
        }

        return service;
    }

})(angular);