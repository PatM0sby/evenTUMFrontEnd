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
            })
            .when("/Caterer/:id/edit", {
                templateUrl: "app/templates/Caterer/edit.html",
                controller: "CatererEditController"
        });
    }

    function CatererCreateController ($scope, $http, $location) {
        $scope.cat = {};

        $scope.createCat = function(){
            $http.post("http://localhost:3000/api/caterer", $scope.cat)
                .success(function(response){
                    console.log(response);
                    $location.url("/Caterer");
                });
        }
    }

    function CatererListController ($scope, $http) {
        $scope.message = "Possible caterer";

        $http.get("http://localhost:3000/api/caterer").success(function (response) {
            $scope.Caterer = response;
        }).error(function(err){
            $scope.error = err;
        })

        $scope.deleteCat = function(cat){
            $http.delete("http://localhost:3000/api/caterer/" + cat._id).success(function(response){
                $scope.Caterer.pop(cat);
            });
        };
    }

    function CatererEditController ($scope, $http, $location, $routeParams) {
        $scope.cat = {};
        var id = $routeParams.id;

        $http.get("http://localhost:3000/api/caterer/" + id).success(function (response) {
            $scope.cat = response;
        });

        $scope.saveCat = function() {
            $http.put("http://localhost:3000/api/caterer" + $scope.cat._id, $scope.cat)
                .success(function(response){ $location.url("/Caterer")});
        };
    };
})(angular);