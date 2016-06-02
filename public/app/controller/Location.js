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
    }
})(angular);