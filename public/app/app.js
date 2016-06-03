(function (angular) {
    "use strict";

    angular.module ("EvenTUM", ["ngRoute", "EvenTUMLocation", "EvenTUMCaterer", "EvenTUMInvitation"])
        .config(config);

    config.$inject = ["$routeProvider"];

    function config ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/Location'});
    }
})(angular);