(function (angular) {
    "use strict";

    angular.module('Helper', [])
        .factory('LocationFactory', LocationFactory)
        .factory('ArrayHelper', ArrayHelper);

    LocationFactory.$inject = ['$rootScope', '$location'];

    function LocationFactory ($rootScope, $location) {
        return {
            goBack: function () {
                var lastPath = $rootScope.history[$rootScope.history.length - 2];

                $location.path(lastPath);
            }
        };
    }
    
    function ArrayHelper () {
        return {
            deleteObject: function (obj, arr, needle) {
                arr.forEach(function (c, i, a) {
                    console.log(c, obj);
                    if (c[needle] === obj[needle]) {
                        arr.splice(i, 1);
                    }
                });

                return arr;
            }
        };
    }

})(angular);