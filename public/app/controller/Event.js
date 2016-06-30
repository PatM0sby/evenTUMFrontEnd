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
    EventEditCtrl.$inject = ['$scope', 'TestDataService', '$location', 'DataService'];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when('/event', {
                templateUrl: "app/templates/event/event-list.html",
                controller: 'EventListCtrl'
            })
            .when('/event/create', {
                templateUrl: 'app/templates/event/event-edit.html',
                controller: 'EventEditCtrl'
            })
            .when('/event/:id', {
                templateUrl: "app/templates/event/event-detail.html",
                controller: 'EventCtrl'
            })
            .when('/event/:id/edit', {
                templateUrl: 'app/templates/event/event-edit.html',
                controller: 'EventEditCtrl'
            });
    }
    
    function EventListCtrl ($scope, TestDataService) {
        $scope.events = TestDataService.get('events.json', {clear: false, subObj: 'events'});
        $scope.events.then(function (result) {
            $scope.events = result;
        });

        $scope.$watch('events', function (n, o) {

            TestDataService.save('events.json', n);

        }, true);

        $scope.deleteEvent = function (id) {
            TestDataService.delete('events.json', id)
                .then(function (res) {
                    console.log(res);
                    $scope.events = res;
                });
        }

    }
    
    function EventCtrl ($scope) {}
    
    function EventEditCtrl ($scope, TestDataService, $location, DataService) {
        $scope.event = {};
        $scope.events = TestDataService.get('events.json', {clear: false, subObj: 'events'});
        $scope.exist = false;

        var locGet = new DataService();
            locGet.get('locations')
                .then(function (res) {
                    $scope.locations = res;
                });

        var catGet = new DataService();
            catGet.get('caterer')
                .then(function (res) {
                    $scope.caterer = res;
                });
        
        $scope.save = function () {
            console.log($scope.event);
            $scope.alertDialog = {visible: false};

            if (!$scope.event.location || $scope.event.location === 'no selected') {
                $scope.alertDialog = {
                    msg: 'Please select a location',
                    priority: 'warning',
                    visible: true,
                    selector: 'form'
                };
            } else if (!$scope.event.caterer || $scope.event.caterer === 'no selected') {
                $scope.alertDialog = {
                    msg: 'Please select a caterer',
                    priority: 'warning',
                    visible: true,
                    selector: 'form'
                };
            } else {
                
                $scope.events.then(function (result) {
                    $scope.events = result;

                    $scope.events.push($scope.event);

                    TestDataService.save('events.json', $scope.events)
                        .then(function (res) {
                            console.log(res);
                            $location.path('/event');
                        });
                });
            }
        };

    }
    
})(angular);