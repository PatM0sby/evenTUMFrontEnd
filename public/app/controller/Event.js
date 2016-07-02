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
    EventListCtrl.$inject = ['$scope', 'DataService'];
    EventCtrl.$inject = ['$scope', '$routeParams', 'DataService'];
    EventEditCtrl.$inject = ['$scope', '$routeParams', '$location', 'DataService', 'currUser'];

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
            .when('/event/edit/:id', {
                templateUrl: 'app/templates/event/event-edit.html',
                controller: 'EventEditCtrl'
            })
            .when('/event/:id', {
                templateUrl: "app/templates/event/event-detail.html",
                controller: 'EventCtrl'
            });
    }
    
    function EventListCtrl ($scope, DataService) {
        var Events = new DataService('events');

        Events.get()
            .then(function (res) {
                $scope.events = res;
                console.log(res);
            });

        $scope.$watch('events', function (n, o) {

            //TestDataService.save('events.json', n);

        }, true);

        $scope.deleteEvent = function (id) {
            Events.delete(id)
                .then(function (res) {
                    console.log(res);
                    $scope.events = res;
                });
        }

    }
    
    function EventCtrl ($scope, $routeParams, DataService) {
        var Event = new DataService('events/' + $routeParams.id);

        Event.get()
            .then(function (res) {
                var Location = new DataService('locations/' + res.location);
                var Caterer = new DataService('caterer/' + res.caterer);

                Location.get()
                    .then(function (loc) {
                        res.loc = loc;
                    });

                Caterer.get()
                    .then(function (cat) {
                        res.cat = cat;
                    });

                $scope.event = res;


            });


        $scope.invitees = [{}];

        $scope.addInvitee = function () {
            $scope.invitees.push({});
        };

        $scope.deleteInvitee = function (id) {
            $scope.invitees.splice(id, 1);
            console.log($scope.invitees);

        };
    }
    
    function EventEditCtrl ($scope, $routeParams, $location, DataService, currUser) {
        var saveMethod, eventPath = $routeParams.id ? 'events/' + $routeParams.id : 'events';

        var Event = new DataService(eventPath);
        var Locations = new DataService('locations');
        var Caterers = new DataService('caterer');

        Locations.get()
            .then(function (res) {
                $scope.locations = res;
            });
        
        Caterers.get()
            .then(function (res) {
                $scope.caterers = res;
            });

        $scope.exist = false;

        if ($routeParams.id) {
            Event.get()
                .then(function (res) {

                    console.log(res);
                    $scope.event = res;
                });

            $scope.exist = true;

            saveMethod = 'update';
        } else {
            $scope.event = {
                token: currUser.getToken()
            };

            saveMethod = 'create';
        }

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
                Event[saveMethod]($scope.event)
                    .then(function (res) {
                        console.log(res);
                        $location.path('event');
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        };

    }
    
})(angular);