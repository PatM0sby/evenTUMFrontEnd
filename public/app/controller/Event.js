/**
 * Created by Flo on 23.06.16.
 */
/**
 * Refaktoring, damit Dateien minifiziert werden können und trotzdem Funktionalität erhalten bleibt
 */
(function (angular) {
    "use strict";

    angular.module("EvenTUMEvent", ["ngRoute"])
        .config(config)
        .controller('EventListCtrl', EventListCtrl)
        .controller('EventCtrl', EventCtrl)
        .controller('EventEditCtrl', EventEditCtrl);

    // dependencies
    config.$inject = ["$routeProvider"];
    EventListCtrl.$inject = ['$scope', 'TestDataService'];
    EventCtrl.$inject = ['$scope'];
    EventEditCtrl.$inject = ['$scope'];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/event", {
                templateUrl: "app/templates/event/event-list.html",
                controller: 'EventListCtrl'
            })
            .when('/event/:id', {
                templateUrl: "app/templates/event/event-detail.html",
                controller: 'EventCtrl'
            })
            .when('/event/:id/edit', {
                templateUrl: 'app/templates/event/event-edit.html',
                controller: 'EventEditCtrl'
            })
            .when('/event/create', {
                templateUrl: 'app/templates/event/event-edit.html',
                controller: 'EventEditCtrl'
            });
    }
    
    function EventListCtrl ($scope, TestDataService) {
        TestDataService.get('events.json', function (data) {
            $scope.events = data.events;
        });
    }
    
    function EventCtrl ($scope) {}
    
    function EventEditCtrl ($scope) {}
    
})(angular);