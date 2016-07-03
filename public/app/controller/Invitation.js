(function (angular) {
    "use strict";

    angular.module("EvenTUMInvitation", ["ngRoute"])
        .config(config)
        .controller("InvitationListController", InvitationListController)
        .controller("InvitationEditController", InvitationEditController);

    // dependencies
    config.$inject = ["$routeProvider"];
    InvitationListController.$inject = ["$scope", "DataService"];
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


    function InvitationListController ($scope, DataService) {
        var Invitation = new DataService('invitations');

        Invitation.get()
            .then(function (data) {
                $scope.invitation = data;
            });

        $scope.$watch('invitation', function (n, o) {

            //TestDataService.save('events.json', n);

        }, true);

        $scope.deleteCat = function (id) {

            Invitation.delete(id)
                .then(function (res) {
                    console.log(res);

                    //$scope.Invitation.splice($scope.Invitation.indexOf(res), 1);
                });
        };
    }

    function InvitationEditController ($scope, $location, $routeParams, DataService) {
        var dataPath = 'invitations',
            saveAction = 'create';

        $scope.selected = true;
        $scope.inv = {};

        if ($routeParams.id) {
            dataPath = dataPath + '/' + $routeParams.id;
            saveAction = 'update';
            $scope.selected = false;
        }

        var Invitation = new DataService(dataPath);

        if ($routeParams.id) {
            Invitation.get()
                .then(function (res) {
                    $scope.inv = res;
                });
        }

        $scope.save = function () {
            Invitation[saveAction]($scope.inv)
                .then(function (res) {
                    $location.url("/invitation");
                });
        };
    }
})(angular);