(function (angular) {
    "use strict";
    
    angular.module("EvenTUMCaterer", ["ngRoute"])
        .config(config)
        .controller("CatererListController", CatererListController)
        .controller("CatererEditController", CatererEditController);

    // dependencies
    config.$inject = ["$routeProvider"];
    CatererListController.$inject = ["$scope", "DataService", "ArrayHelper"];
    CatererEditController.$inject = ["$scope", "$location", "$routeParams", "DataService"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/caterer", {
                templateUrl: "app/templates/caterer/list.html",
                controller: "CatererListController"
            })
            .when("/caterer/new", {
                templateUrl: "app/templates/caterer/edit.html",
                controller: "CatererEditController"
            })
            .when("/caterer/:id/edit", {
                templateUrl: "app/templates/caterer/edit.html",
                controller: "CatererEditController"
        });
    }
    
    function CatererListController ($scope, DataService, ArrayHelper) {
        var Caterer = new DataService('caterer');

        Caterer.get()
            .then(function (res) {
                $scope.caterer = res.data;
            });
        
        $scope.deleteCat = function (id) {
            Caterer.delete(id)
                .then(function (res) {
                    $scope.caterer = ArrayHelper.deleteObject(res.data, $scope.caterer, '_id');
                }, function (err) {
                    console.log(err);
                });
        };
    }

    function CatererEditController ($scope, $location, $routeParams, DataService) {
        var dataPath = 'caterer',
            saveMethod = 'create';

        var Caterer = new DataService(dataPath);

        $scope.selected = true;
        $scope.cat = {};

        if ($routeParams.id) {
            dataPath = dataPath + '/' + $routeParams.id;
            saveMethod = 'update';
            $scope.selected = false;

            Caterer = new DataService(dataPath);

            Caterer.get()
                .then(function (res) {
                    $scope.cat = res.data;
                });
        }

        $scope.save = function () {
            Caterer[saveMethod]($scope.cat)
                .then(function (res) {
                    $location.url("/caterer");
                });
        };
    }
})(angular);