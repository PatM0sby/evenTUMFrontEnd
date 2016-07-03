(function (angular) {
    "use strict";

    angular.module("EvenTUMLocation", ["ngRoute"])
        .config(config)
        .controller("LocationListController", LocationListController)
        .controller("LocationEditController", LocationEditController);

    //dependencies
    config.$inject = ["$routeProvider"];
    LocationListController.$inject = ["$scope", "DataService"];
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


    function LocationListController ($scope, DataService) {
        var Location = new DataService('locations');

        Location.get()
            .then(function (data) {
            $scope.location = data;
        });






        $scope.deleteLoc = function(Loc){
           /* $http.delete(api + "locations/" + Loc._id).success(function(response){
                console.log(response);
                $scope.Location.splice($scope.Location.indexOf(Loc),1);
            });*/
        };
    }

    function LocationEditController ($scope, $location, $routeParams, DataService) {
        var dataPath = 'locations',
            saveAction = 'create';

        $scope.selected= true;
        $scope.loc = {};

        if ($routeParams.id) {
            dataPath = dataPath + '/' + $routeParams.id;
            saveAction = 'update';
            $scope.selected = false;
        }

        var Location = new DataService(dataPath);

        if ($routeParams.id) {
            Location.get()
                .then(function (res) {
                    $scope.loc = res;
                });
        }

        $scope.save = function () {
            Location[saveAction]($scope.loc)
                .then(function  (res) {
                    $location.url("location");
                });
        };
    }
})(angular);