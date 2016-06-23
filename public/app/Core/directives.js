(function (angular) {
    "use strict";
    
    angular.module("Directives", [])
        .directive('alertDialog', alertDialog);

        function alertDialog () {
            return {
                restrict: 'A',
                scope: {
                    message: '=msg',
                    priority: '=priority',
                    visible: '=visible'
                },
                replace: true,
                templateUrl: 'app/templates/Directives/alert.html'
            };
        }
})(angular);