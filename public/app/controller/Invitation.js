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
        .controller("InvitationListController", InvitationListController);

    // dependencies
    config.$inject = ["$routeProvider"];
    InvitationCreateController.$inject = ["$scope", "$http", "$location"];
    InvitationListController.$inject = ["$scope", "$http"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/Invitation", {
                templateUrl: "app/templates/Invitation/list.html",
                controller: "InvitationListController"
            })
            .when("/Invitation/new", {
                templateUrl: "app/templates/Invitation/create.html",
                controller: "InvitationCreateController"
            })
            .when("/Invitation/:id/edit", {
                templateUrl: "app/templates/Invitation/edit.html",
                controller: "InvitationEditController"
        });
    }

    function InvitationCreateController ($scope, $http, $location) {
        $scope.inv = {};

        $scope.createInv = function(){
            $http.post("http://localhost:3000/api/invitations", $scope.inv)
                .success(function(response){
                    console.log(response);
                    $location.url("/Invitation");
                });
        }
    }

    function InvitationListController ($scope, $http) {
        $scope.message = "Possible Invitations";

        $http.get("http://localhost:3000/api/invitations").success(function (response) {
            $scope.Invitations = response;
        }).error(function(err){
            $scope.error = err;
        });
        $scope.deleteInv = function(inv){
            $http.delete("http://localhost:3000/api/invitations/" + inv._id).success(function(response){
                console.log(response);
                $scope.Invitations.pop(inv);
            });
        };
    }

    function InvitationEditController ($scope, $http, $location, $routeParams) {
        $scope.inv = {};
        var id = $routeParams.id;

        $http.get("http://localhost:3000/api/invitations/" + id).success(function (response) {
            $scope.inv = response;
        });

        $scope.saveInv = function() {
            $http.put("http://localhost:3000/api/invitations" + $scope.inv._id, $scope.inv)
                .success(function(response){ $location.url("/Invitation")});
        };
    };
})(angular);