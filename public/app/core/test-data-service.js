(function (angular) {
    "use strict";

    angular.module('TestData', [])
        .service('TestDataService', TestDataService);

    TestDataService.$inject = ['$resource', '$q'];

    function TestDataService($resource, $q) {

        this.get = function (filename, config) {
            config = config || {clear: false, subObj: ''};
            var storageId = filename.split('.')[0],
                deferred = $q.defer();

            if (localStorage.getItem(storageId) && localStorage.getItem(storageId).length > 0) {
                deferred.resolve(JSON.parse(localStorage.getItem(storageId)));

            } else {
                var resource = $resource('server/' + filename);

                resource.get(function (data) {
                    localStorage.setItem(storageId, JSON.stringify(data[config.subObj]));

                    deferred.resolve(data[config.subObj]);
                });
            }

            return deferred.promise;
        };

        this.save = function (filename, data) {
            var storageId = filename.split('.')[0],
                deferred = $q.defer();

            localStorage.setItem(storageId, JSON.stringify(data));
            
            deferred.resolve('saved');

            return deferred.promise;
        };

        this.delete = function (filename, id) {
            var storageId = filename.split('.')[0],
                deferred = $q.defer();

            var storage = JSON.parse(localStorage.getItem(storageId));
                storage.splice(id, 1);

            localStorage.setItem(storageId, JSON.stringify(storage));

            deferred.resolve(storage);

            return deferred.promise;
        };
    }

})(angular);