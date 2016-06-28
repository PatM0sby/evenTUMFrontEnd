(function (angular) {
    "use strict";

    angular.module('TestData', [])
        .service('TestDataService', TestDataService);

    TestDataService.$inject = ['$resource'];

    function TestDataService ($resource) {
        this.get = function (filename , cb) {
            var resource = $resource('server/' + filename);

            return resource.get(cb);
        };
    }

})(angular);