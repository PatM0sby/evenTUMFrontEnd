(function (angular) {
    "use strict";

    angular.module('Data', [])
        .service('DataService', DataService);

    DataService.$inject = ['$http', 'API', 'currUser'];


    function DataService ($http, api, currUser) {
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

        function getData (path, cb) {
            var config = getAuth(),
                url = api + path;

            $http.get(url, config)
                .success(cb);
            //.error();
        }

        function createData (path, cb, data) {
            var config = getAuth(),
                url = api + path;

            if(!data){
                console.log('no data set');
                return false;
            }

            $http.post(url, data, config)
                .success(cb);
        }

        function updateData (path, cb, data) {
            var config = getAuth(),
                url = api + path;

            if(!data){
                console.log('no data to update');
                return false;
            }

            $http.put(url, data, config)
                .success(cb);
        }

        function deleteData (path, cb) {
            var config = getAuth(),
                url = api + path;
            
            $http.delete(url, config)
                .success(cb);
        }

    }

})(angular);