(function (angular) {
    "use strict";

    angular.module("EvenTUMLocation", ["ngRoute"])
        .config(config)
        .controller("LocationListController", LocationListController)
        .controller("LocationEditController", LocationEditController);

    //dependencies
    config.$inject = ["$routeProvider"];
    LocationListController.$inject = ["$scope", "DataService", "ArrayHelper"];
    LocationEditController.$inject = ["$scope", "$location", "$routeParams", "DataService"];

    //functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/location", {
                templateUrl: "app/templates/location/list.html",
                controller: "LocationListController"
            })
            .when("/location/new", {
                templateUrl: "app/templates/location/edit.html",
                controller: "LocationEditController"
            })
            .when("/location/:id/edit", {
                templateUrl: "app/templates/location/edit.html",
                controller: "LocationEditController"
            });
    }

    function LocationListController ($scope, DataService, ArrayHelper) {
        var Location = new DataService('locations');

        Location.get()
            .then(function (res) {
                $scope.location = res.data;
            });

        $scope.deleteLoc = function(id){
            Location.delete(id)
                .then(function (res) {
                    console.log(res.data);
                    $scope.location = ArrayHelper.deleteObject(res.data, $scope.location, '_id');
                }, function (err) {
                    console.log(err);
                });
        };
    }

    function LocationEditController ($scope, $location, $routeParams, DataService) {
        var dataPath = 'locations',
            saveMethod = 'create';

        var Location = new DataService(dataPath);

        $scope.selected= true;
        $scope.loc = {};

        if ($routeParams.id) {
            dataPath = dataPath + '/' + $routeParams.id;
            saveMethod = 'update';
            $scope.selected = false;

            Location = new DataService(dataPath);

            Location.get()
                .then(function (res) {
                    $scope.loc = res.data;
                });
        }

        $scope.save = function () {
            Location[saveMethod]($scope.loc)
                .then(function  (res) {
                    $location.url("location");
                });
        };
    }
})(angular);