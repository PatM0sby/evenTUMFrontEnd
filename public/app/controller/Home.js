/**
 * Created by AndreasHorn on 15/06/16.
 */
/**
 * Refaktoring, damit Dateien minifiziert werden können und trotzdem Funktionalität erhalten bleibt
 */
(function (angular) {
    "use strict";

    /**
     * Defining section for controllers, directives and more
     *
     * TODO: adding delete and update functionality
     */
    angular.module("EvenTUMHome", ["ngRoute"])
        .config(config);


    // dependencies
    config.$inject = ["$routeProvider"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "old-app-refernece/templates/User/home.html"
            });
    }

})(angular);