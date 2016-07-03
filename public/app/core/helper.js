(function (angular) {
    "use strict";

    angular.module('Helper', [])
        .factory('LocationFactory', LocationFactory);

    LocationFactory.$inject = ['$rootScope', '$location'];

    function LocationFactory ($rootScope, $location) {
        return {
            goBack: function () {
                var lastPath = $rootScope.history[$rootScope.history.length - 2];

                $location.path(lastPath);
            }
        };
    }

})(angular);