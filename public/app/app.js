(function (angular) {
    "use strict";

    angular.module ("EvenTUM", ["ngRoute", "EvenTUMLocation", "EvenTUMCaterer", "EvenTUMInvitation", "EvenTUMHome"])
        .config(config);

    config.$inject = ["$routeProvider"];

    function config ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }
})(angular);