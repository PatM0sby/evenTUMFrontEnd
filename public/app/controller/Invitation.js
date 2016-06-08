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
        console.log("Zeile 33 Invitation Controller Routes" );
    }

    function InvitationCreateController ($scope, $http, $location) {
        $scope.Inv = {};

        $scope.createInv = function(){
            $http.post("http://localhost:3000/api/invitations", $scope.Inv)
                .success(function(response){
                    console.log(response);
                    $location.url("/Invitation");
                });
        }
        
    }

    function InvitationListController ($scope, $http) {
        $scope.message = "Possible Invitations";

        $http.get("http://localhost:3000/api/invitations").success(function (response) {
            $scope.inv = response;
        }).error(function(err){
            $scope.error = err;
        });
        $scope.deleteInv = function(Inv){
            $http.delete("http://localhost:3000/api/invitations/" + Inv._id).success(function(response){
                $scope.Invitation.pop(Inv);
            });
        };
    }

    function InvitationEditController ($scope, $http, $location, $routeParams) {
        $scope.Inv = {};
        var id = $routeParams.id;

        $http.get("http://localhost:3000/api/invitations/" + id).success(function (response) {
            $scope.Inv = response;
        });

        $scope.saveCat = function() {
            $http.put("http://localhost:3000/api/invitations" + $scope.Inv._id, $scope.Inv)
                .success(function(response){ $location.url("/Invitation")});
        };
    };
})(angular);