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
        .controller("CatererListController", CatererListController)
        .controller("CatererEditController", CatererEditController);

    // dependencies
    config.$inject = ["$routeProvider"];
    CatererCreateController.$inject = ["$scope", "$location", "DataService"];
    CatererListController.$inject = ["$scope", "DataService"];
    CatererEditController.$inject = ["$scope", "$location", "$routeParams", "DataService"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/caterer", {
                templateUrl: "app/templates/caterer/list.html",
                controller: "CatererListController"
            })
            .when("/caterer/new", {
                templateUrl: "app/templates/caterer/create.html",
                controller: "CatererCreateController"
            })
            .when("/caterer/:id/edit", {
                templateUrl: "app/templates/caterer/edit.html",
                controller: "CatererEditController"
        });
    }

    function CatererCreateController ($scope, $location, DataService) {
        var Caterer = DataService;
        $scope.cat = {};

        $scope.createCat = function () {
            Caterer.create('caterer', callback, $scope.cat)
                .then(function (res) {
                    console.log(res);

                    $location.url("/caterer");
                });
        }
    }

    function CatererListController ($scope, DataService) {
        var Caterer = DataService;
        $scope.message = "Possible caterer";

        Caterer.get('caterer')
            .then(function (data) {
                $scope.Caterer = data;
            });

        
        $scope.deleteCat = function (cat) {
            Caterer.delete('caterer/' + cat._id)
                .then(function (res) {
                    console.log(res);

                    $scope.Caterer.splice($scope.Caterer.indexOf(cat), 1);
                });
        };
    }

    function CatererEditController ($scope, $location, $routeParams, DataService) {
        $scope.cat = {};
        var Caterer = DataService,
            id = $routeParams.id;

        Caterer.get('caterer/' + id)
            .then(function (res) {
                $scope.cat = res;
            });

        $scope.saveCat = function () {
            Caterer.update('caterer/' + $scope.cat._id, $scope.cat)
                .then(function (res) {
                    console.log(res);

                    $location.url("/caterer");
                });
        };
    }
})(angular);