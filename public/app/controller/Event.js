/**
 * Created by Flo on 23.06.16.
 */
/**
 * Refaktoring, damit Dateien minifiziert werden können und trotzdem Funktionalität erhalten bleibt
 */
(function (angular) {
    "use strict";

    angular.module("EvenTUMEvent", ["ngRoute"])
        .config(config);

    // dependencies
    config.$inject = ["$routeProvider"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/Event", {
                templateUrl: "old-app-refernece/templates/Event/event.html"
            });
    }
})(angular);