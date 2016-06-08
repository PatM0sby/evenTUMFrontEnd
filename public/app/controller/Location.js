(function (angular) {
    "use strict";

    angular.module("EvenTUMLocation", ["ngRoute"])
        .config(config)
        .controller("LocationCreateController", LocationCreateController)
        .controller("LocationListController", LocationListController);

    config.$inject = ["$routeProvider"];
    LocationCreateController.$inject = ["$scope", "$http", "$location"];
    LocationListController.$inject = ["$scope", "$http"];

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

    function LocationCreateController ($scope, $http, $location) {
        $scope.Loc = {};

        $scope.createLoc = function(){
            console.log("Page 8");
            $http.post("http://localhost:3000/api/locations", $scope.Loc)
                .success(function(response){
                    console.log(response);
                    $location.url("/Location");
                });
        }
    }

    function LocationListController ($scope, $http) {
        $scope.message = "Possible location";

        $http.get("http://localhost:3000/api/locations").success(function (response) {
            console.log(response);
            $scope.Location = response;
        }).error(function(err){
            $scope.error = err;
        });
        $scope.deleteLoc = function(Loc){
            $http.delete("http://localhost:3000/api/locations/" + Loc._id).success(function(response){
                $scope.Location.pop(Loc);
            });
        };
    }

    function LocationEditController ($scope, $http, $location, $routeParams) {
        $scope.Loc = {};
        var id = $routeParams.id;

        $http.get("http://localhost:3000/api/locations/" + id).success(function (response) {
            $scope.Loc = response;
        });

        $scope.saveCat = function() {
            $http.put("http://localhost:3000/api/locations" + $scope.Loc._id, $scope.Loc)
                .success(function(response){ $location.url("/Location")});
        };
    }
})(angular);