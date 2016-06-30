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
            var callback = function (res) {
                console.log(res);

                $location.url("/caterer");
            };

            Caterer.create('caterer', callback, $scope.cat);
        }
    }

    function CatererListController ($scope, DataService) {
        var Caterer = DataService;
        $scope.message = "Possible caterer";

        Caterer.get('caterer', getSuccess);

        function getSuccess (data) {
            $scope.Caterer = data;
        }
        
        $scope.deleteCat = function (cat) {
            Caterer.delete('caterer/' + cat._id, function (res) {
                console.log(res);

                $scope.Caterer.splice($scope.Caterer.indexOf(cat),1);
            });
        };
    }

    function CatererEditController ($scope, $location, $routeParams, DataService) {
        $scope.cat = {};
        var Caterer = DataService,
            id = $routeParams.id;

        Caterer.get('caterer/' + id, function (res) {
            $scope.cat = res;
        });

        $scope.saveCat = function () {
            var callback = function (res) {
                console.log(res);

                $location.url("/caterer");
            };

            Caterer.update('caterer/' + $scope.cat._id, callback, $scope.cat);
        };
    }
})(angular);