(function (angular) {
    "use strict";
    
    angular.module("Directives", [])
        .directive('alertDialog', alertDialog)
        .directive('navbar', navbar);

        function alertDialog () {
            return {
                restrict: 'A',
                scope: {
                    message: '=msg',
                    priority: '=priority',
                    visible: '=visible',
                    name: '@name',
                    selector: '=selector'
                },
                link: function (scope, element, attrs) {
                    scope.$watch('visible', function (n, o) {
                        if (n && scope.name === scope.selector) {
                            scope.show = true;
                        }else{
                            scope.show = false;
                        }
                    });

                    scope.closeDialog = function () {
                        scope.visible = false;

                    };
                },
                replace: true,
                templateUrl: 'old-app-refernece/templates/Directives/alert.html'
            };
        }

        function navbar () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'old-app-refernece/templates/Directives/navigation.html'
            };
        }
})(angular);