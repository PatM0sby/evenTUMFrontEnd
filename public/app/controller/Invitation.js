(function (angular) {
    "use strict";

    angular.module("EvenTUMInvitation", ["ngRoute"])
        .config(config)
        .controller("InvitationListController", InvitationListController)
        .controller("InvitationEditController", InvitationEditController);

    // dependencies
    config.$inject = ["$routeProvider"];
    InvitationListController.$inject = ["$scope", "DataService", "ArrayHelper"];
    InvitationEditController.$inject = ["$scope", "$location", "$routeParams", "DataService"];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/invitation", {
                templateUrl: "app/templates/invitation/list.html",
                controller: "InvitationListController"
            })
            .when("/invitation/new", {
                templateUrl: "app/templates/invitation/edit.html",
                controller: "InvitationEditController"
            })
            .when("/invitation/:id/edit", {
                templateUrl: "app/templates/invitation/edit.html",
                controller: "InvitationEditController"
            });
    }

    function InvitationListController ($scope, DataService, ArrayHelper) {
        var Invitation = new DataService('invitations');

        Invitation.get()
            .then(function (res) {
                $scope.invitation = res.data;
            });

        $scope.deleteInv = function (id) {
            Invitation.delete(id)
                .then(function (res) {
                    $scope.invitation = ArrayHelper.deleteObject(res.data, $scope.invitation, '_id');
                }, function (err) {
                    console.log(err);
                });
        };
    }

    function InvitationEditController ($scope, $location, $routeParams, DataService) {
        var dataPath = 'invitations',
            saveMethod = 'create';

        var Invitation = new DataService(dataPath);

        $scope.selected = true;
        $scope.inv = {};

        if ($routeParams.id) {
            dataPath = dataPath + '/' + $routeParams.id;
            saveMethod = 'update';
            $scope.selected = false;

            Invitation = new DataService(dataPath);
            
            Invitation.get()
                .then(function (res) {
                    $scope.inv = res.data;
                });
        }

        $scope.save = function () {
            Invitation[saveMethod]($scope.inv)
                .then(function (res) {
                    $location.url("/invitation");
                });
        };
    }
})(angular);