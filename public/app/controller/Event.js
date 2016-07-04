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
    EventListCtrl.$inject = ['$scope', 'DataService', 'ArrayHelper'];
    EventCtrl.$inject = ['$scope', '$routeParams', 'DataService'];
    EventEditCtrl.$inject = ['$scope', '$routeParams', 'DataService', 'currUser', 'LocationFactory'];

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
    
    function EventListCtrl ($scope, DataService, ArrayHelper) {
        var Events = new DataService('events');

        Events.get()
            .then(function (res) {
                $scope.events = res.data;
            });

        $scope.deleteEvent = function (id) {
            Events.delete(id)
                .then(function (res) {
                    $scope.events = ArrayHelper.deleteObject(res.data, $scope.events, '_id');
                }, function (err) {
                    console.log(err);
                });
        }

    }
    
    function EventCtrl ($scope, $routeParams, DataService) {
        var Event = new DataService('events/' + $routeParams.id);

        Event.get()
            .then(function (res) {
                var event = res.data;
                var Location = new DataService('locations/' + event.location);
                var Caterer = new DataService('caterer/' + event.caterer);

                Location.get()
                    .then(function (loc) {
                        event.loc = loc.data;
                        start();
                    });

                Caterer.get()
                    .then(function (cat) {
                        event.cat = cat.data;
                    });
                
                $scope.event = event;

                if ($scope.event.invitation && $scope.event.invitation.settings) {
                    $scope.invitation = $scope.event.invitation.settings;
                } else {
                    $scope.invitation = {
                        template: '',
                        salutation: '',
                        message: ''
                    };
                }

                if ($scope.event.invitation && $scope.event.invitation.invitees.length >= 1) {
                    $scope.invitees = $scope.event.invitation.invitees;
                } else {
                    $scope.invitees = [{name: '', email: ''}];
                }
            });

        $scope.addInvitee = function () {
            $scope.invitees.push({name: '', email: ''});
        };

        $scope.deleteInvitee = function (person) {
            var id = $scope.invitees.indexOf(person);

            console.log(id);
            $scope.invitees.splice(id, 1);
        };
        
        $scope.updateEvent = function () {
            $scope.event.invitation = {
                invitees: $scope.invitees,
                settings: $scope.invitation
            };

            Event.update($scope.event);
        };

        $scope.sendInvitations = function () {
            console.log('invitations send!')
        };
    }
    
    function EventEditCtrl ($scope, $routeParams, DataService, currUser, LocationFactory, $q) {
        var saveMethod,
            eventPath = $routeParams.id ? 'events/' + $routeParams.id : 'events';

        var Event = new DataService(eventPath);
        var Locations = new DataService('locations');
        var Caterers = new DataService('caterer');

        Locations.get()
            .then(function (res) {
                $scope.locations = res.data;
                for (i = 0; i < $scope.locations.length; i++){
                    $scope.createMarker($scope.locations[i]);}
            });
        
        Caterers.get()
            .then(function (res) {
                $scope.caterers = res.data;
            });

        $scope.exist = false;

        if ($routeParams.id) {
            Event.get()
                .then(function (res) {
                    $scope.event = res.data;
                });

            $scope.exist = true;

            saveMethod = 'update';
        } else {
            $scope.event = {
                user: currUser.getUser()._id
            };

            saveMethod = 'create';
        }

        $scope.save = function () {
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
                        LocationFactory.goBack();
                    });
            }
        };

        //Google Maps

        
        $scope.toggleMap= function() {
            //toggle visibility
            $scope.showMap = !$scope.showMap;
            google.maps.event.trigger($scope.map, 'resize');

        };
        

        $scope.markers = [];

        $scope.map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(48.135125, 11.581981),
            zoom: 12
        });

        $scope.infoWindow = new google.maps.InfoWindow({});

        
        /*since there is an angular-maps-bug that occurs upon toggling map visibility,
        resulting in the map not reacting and loading properly
        this listener is added to detect the bug and resize the map. More Info:
         */
        google.maps.event.addListener($scope.map, "idle", function()
        {
            google.maps.event.trigger($scope.map, 'resize');
        });

        

        $scope.createMarker = function (location) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                    'address': location.address+", "+ location.place
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var marker = new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: $scope.map,
                            title: location.name,
                            content: '<div class="infoWindowContent">' + location.description + '</div>'
                        });



                        google.maps.event.addListener(marker, 'click', function () {
                            $scope.infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                            $scope.infoWindow.open($scope.map, marker);
                        });
                        $scope.markers.push(marker);
                    }

                });
        };
        var i;





        
    }
})(angular);