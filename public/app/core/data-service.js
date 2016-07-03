(function (angular) {
    "use strict";

    angular.module('Data', [])
        .service('DataService', DataService);

    DataService.$inject = ['$http', 'API', 'currUser', '$q'];


    function DataService ($http, api, currUser, $q) {
        function service (path) {
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

                return $http.get(this.url, config);
            }

            function createData(data) {
                var config = getAuth();

                return $http.post(this.url, data, config);
            }

            function updateData(data) {
                var config = getAuth();

                return $http.put(this.url, data, config);
            }

            function deleteData(id) {
                var config = getAuth(),
                    url = id ? this.url + '/' + id : this.url;

                return $http.delete(url, config);
            }
        }

        return service;
    }

})(angular);