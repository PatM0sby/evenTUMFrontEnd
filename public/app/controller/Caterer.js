(function (angular) {
    "use strict";
    
    angular.module("EvenTUMCaterer", ["ngRoute"])
        .config(config)
        .controller("CatererListController", CatererListController)
        .controller("CatererEditController", CatererEditController);

    // dependencies
    config.$inject = ["$routeProvider"];
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
                templateUrl: "app/templates/caterer/edit.html",
                controller: "CatererEditController"
            })
            .when("/caterer/:id/edit", {
                templateUrl: "app/templates/caterer/edit.html",
                controller: "CatererEditController"
        });
    }


    function CatererListController ($scope, DataService) {
        var Caterer = new DataService('caterer');

        Caterer.get()
            .then(function (data) {
                $scope.caterer = data;
            });

        $scope.$watch('caterer', function (n, o) {

            //TestDataService.save('events.json', n);

        }, true);
        
        $scope.deleteCat = function (id) {

            Caterer.delete(id)
                .then(function (res) {
                    console.log(res);

                    //$scope.Caterer.splice($scope.Caterer.indexOf(res), 1);
                });
        };
    }

    function CatererEditController ($scope, $location, $routeParams, DataService) {
        var dataPath = 'caterer',
            saveAction = 'create';

        $scope.selected = true;
        $scope.cat = {};

        if ($routeParams.id) {
            dataPath = dataPath + '/' + $routeParams.id;
            saveAction = 'update';
            $scope.selected = false;
        }

        var Caterer = new DataService(dataPath);

        if ($routeParams.id) {
            Caterer.get()
                .then(function (res) {
                    $scope.cat = res;
                });
        }

        $scope.save = function () {
            Caterer[saveAction]($scope.cat)
                .then(function (res) {
                    $location.url("/caterer");
                });
        };
    }
})(angular);