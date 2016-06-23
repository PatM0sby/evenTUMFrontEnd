(function (angular) {
    "use strict";

    angular.module("EvenTUMLocation", ["ngRoute"])
        .constant("API", "http://localhost:3000/api/")
        .config(config)
        .controller("LocationCreateController", LocationCreateController)
        .controller("LocationEditController", LocationEditController)
        .controller("LocationListController", LocationListController);

    config.$inject = ["$routeProvider"];
    LocationCreateController.$inject = ["$scope", "$http", "$location", "API"];
    LocationEditController.$inject = ["$scope", "$http", "$location", "$routeParams", "API"];
    LocationListController.$inject = ["$scope", "$http", "API"];

    function config ($routeProvider) {
        $routeProvider
            .when("/Location", {
                templateUrl: "app/templates/Location/list.html",
                controller: "LocationListController"
            })
            .when("/Location/new", {
                templateUrl: "app/templates/Location/create.html",
                controller: "LocationCreateController"
            })
            .when("/Location/:id/edit", {
                templateUrl: "app/templates/Location/edit.html",
                controller: "LocationEditController"
            });
    }

    function LocationCreateController ($scope, $http, $location, api) {
        $scope.Loc = {};

        $scope.createLoc = function(){
            console.log("Page 8");
            $http.post(api + "locations", $scope.Loc)
                .success(function(response){
                    console.log(response);
                    $location.url("/Location");
                });
        }
    }

    function LocationListController ($scope, $http, api) {
        $scope.message = "Possible location";

        $http.get(api + "locations").success(function (response) {
            console.log(response);
            $scope.Location = response;
        }).error(function(err){
            $scope.error = err;
        });
        $scope.deleteLoc = function(Loc){
            $http.delete(api + "locations/" + Loc._id).success(function(response){
                console.log(response);
                $scope.Location.splice($scope.Location.indexOf(Loc),1);
            });
        };
    }

    function LocationEditController ($scope, $http, $location, $routeParams, api) {
        $scope.Loc = {};
        var id = $routeParams.id;

        $http.get(api + "locations/" + id).success(function (response) {
            console.log(response);
            $scope.Loc = response;
        });

        $scope.saveLoc = function() {
            $http.put(api + "locations/" + id, $scope.Loc)
                .success(function(response){
                    console.log(response);
                    $location.url("/Location")
                });
        };
    }
})(angular);