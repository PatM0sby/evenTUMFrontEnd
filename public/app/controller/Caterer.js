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
    angular.module("EvenTUMCaterer", ["ngRoute"])
        .config(config)
        .controller("CatererCreateController", CatererCreateController)
        .controller("CatererListController", CatererListController);

    // dependencies
    config.$inject = ["$routeProvider"];
    CatererCreateController.$inject = ["$scope", "$http", "$location"];
    CatererListController.$inject = ["$scope", "$http"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/Caterer", {
                templateUrl: "app/templates/Caterer/list.html",
                controller: "CatererListController"
            })
            .when("/Caterer/new", {
                templateUrl: "app/templates/Caterer/create.html",
                controller: "CatererCreateController"
            });
    }

    function CatererCreateController ($scope, $http, $location) {
        $scope.cat = {};

        $scope.createCat = function(){
            $http.post("http://localhost:3000/api/caterers", $scope.cat)
                .success(function(response){
                    console.log(response);
                    $location.url("/Caterer");
                });
        }
    }

    function CatererListController ($scope, $http) {
        $scope.message = "Possible caterer";

        $http.get("http://localhost:3000/api/caterers").success(function (response) {
            $scope.Caterer = response;
        }).error(function(err){
            $scope.error = err;
        });
    }
})(angular);