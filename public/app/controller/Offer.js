/**
 * Created by AndreasHorn on 15/06/16.
 */
/**
 * Refaktoring, damit Dateien minifiziert werden können und trotzdem Funktionalität erhalten bleibt
 */
(function (angular) {
    "use strict";
    
    angular.module("EvenTUMOffer", ["ngRoute"])
        .config(config);

    // dependencies
    config.$inject = ["$routeProvider"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/offer", {
                templateUrl: "app/templates/offer.html"
            });
    }
})(angular);