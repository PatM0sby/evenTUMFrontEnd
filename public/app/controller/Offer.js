/**
 * Created by AndreasHorn on 15/06/16.
 */
/**
 * Refaktoring, damit Dateien minifiziert werden können und trotzdem Funktionalität erhalten bleibt
 */
(function (angular) {
    "use strict";
    
    angular.module("EvenTUMHome", ["ngRoute"])
        .config(config);

    // dependencies
    config.$inject = ["$routeProvider"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/Offer", {
                templateUrl: "app/templates/Offer/offer.html"
            });
    }
})(angular);