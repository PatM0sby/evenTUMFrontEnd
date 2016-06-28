/**
 * Refactoring, damit Dateien minifiziert werden können und trotzdem Funktionalität erhalten bleibt
 */
(function (angular) {
    "use strict";

    /**
     * Defining section for controllers, directives and more
     *
     * TODO: adding delete and update functionality
     */
    angular.module("EvenTUMInvitation", ["ngRoute"])
        .config(config)
        .controller("InvitationCreateController", InvitationCreateController)
        .controller("InvitationListController", InvitationListController)
        .controller("InvitationEditController", InvitationEditController);

    // dependencies
    config.$inject = ["$routeProvider"];
    InvitationCreateController.$inject = ["$scope", "$http", "$location", "API"];
    InvitationListController.$inject = ["$scope", "$http", "API"];
    InvitationEditController.$inject = ["$scope", "$http", "$location", "$routeParams", "API"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/invitation", {
                templateUrl: "app/templates/invitation/list.html",
                controller: "InvitationListController"
            })
            .when("/invitation/new", {
                templateUrl: "app/templates/invitation/create.html",
                controller: "InvitationCreateController"
            })
            .when("/invitation/:id/edit", {
                templateUrl: "app/templates/invitation/edit.html",
                controller: "InvitationEditController"
        });
    }

    function InvitationCreateController ($scope, $http, $location, api) {
        $scope.inv = {
            token: 'bla'
        };

        $scope.createInv = function(){
            $http.post("http://localhost:3000/api/invitations", $scope.inv)
                .success(function(response){
                    console.log(response);
                    $location.url("/invitation");
                });
        }
    }

    function InvitationListController ($scope, $http, api) {
        $scope.message = "Possible Invitations";

        $http.get("http://localhost:3000/api/invitations").success(function (response) {
            $scope.Invitations = response;
        }).error(function(err){
            $scope.error = err;
        });
        $scope.deleteInv = function(inv){
            $http.delete("http://localhost:3000/api/invitations/" + inv._id).success(function(response){
                console.log(response);
                $scope.Invitations.splice($scope.Invitations.indexOf(inv),1);
            });
        };
    }

    function InvitationEditController ($scope, $http, $location, $routeParams, api) {
        $scope.inv = {
            token: 'bla'
        };
        var id = $routeParams.id;

        $http.get("http://localhost:3000/api/invitations/" + id).success(function (response) {
            $scope.inv = response;
        });

        $scope.saveInv = function() {
            $http.put("http://localhost:3000/api/invitations/" + id, $scope.inv)
                .success(function(response){
                    console.log(response);
                    $location.url("/invitation")
                });
        };
    }

   /* function InvitationDeleteController ($scope, $http, $location, $routeParams) {

    }; */
})(angular);