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
        .controller('EventEditCtrl', EventEditCtrl)
        .controller('MapCtrl', MapCtrl);

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

        //MAPS
        $scope.markers = [];

        $scope.map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            center: new google.maps.LatLng(48.135125, 11.581981),
            zoom: 12
        });

        $scope.infoWindow = new google.maps.InfoWindow({});



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
        /*
        for (i = 0; i < $scope.locations.length; i++){
            $scope.createMarker($scope.locations[i]);
        }*/




        
    }

    function MapCtrl ($scope, $routeParams, DataService) {
        /*function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 8,
                center: {lat: -34.397, lng: 150.644}
            });
            var geocoder = new google.maps.Geocoder();

            document.getElementById('submit').addEventListener('click', function() {
                geocodeAddress(geocoder, map);
            });
        }
            */
            //var Locations=$scope.locations;
            var Locations = [{
                "_id": "5778fb3127196aac1cf1111c",
                "place_id": "ChIJEX7aa7V2nkcRdXBHQ7gkgT4",
                "name": "Pat Home",
                "address": "Blodigstraße 20a",
                "zip": 80933,
                "place": "München",
                "capacity": 10,
                "price": 100,
                "description": "Home",
                "__v": 0
            }, {
                "_id": "5778fb5e27196aac1cf1111d",
                "place_id": "ChIJp5hGLexynkcRdpelu3QruZg",
                "name": "TUM",
                "description": "Uni",
                "address": "Boltzmannstraße 1",
                "zip": 88888,
                "place": "Garching",
                "capacity": 5000,
                "price": 999999,
                "__v": 0
            }];

        /*

        //to be used with real Locations straight from the API
        Locations.forEach(function(element) {

               // function geocodeAddress(geocoder, resultsMap) {
                    var address = element.address + " ," + element.zip + " ," + element.place;
                    var address = "Blodigstraße 20a, 80933 München";
                    geocoder.geocode({'address': address}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            console.log(results[0]);
                            resultsMap.setCenter(results[0].geometry.location);
                            var marker = new google.maps.Marker({
                                map: resultsMap,
                                position: results[0].geometry.location
                            });
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                */
        
                //markers.push(marker);
        
        //google.maps.event.addDomListener(window, 'load', initialize);

        $scope.markers = [];

        $scope.map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            center: new google.maps.LatLng(48.135125, 11.581981),
            zoom: 12
        });
      
        $scope.infoWindow = new google.maps.InfoWindow({});



        $scope.createMarker = function (Locations) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                    'address': Locations.address+", "+Locations.place
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var marker = new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: $scope.map,
                            title: Locations.name,
                            content: '<div class="infoWindowContent">' + Locations.description + '</div>'
                        });


                        google.maps.event.addListener(marker, 'click', function () {
                            $scope.infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                            $scope.infoWindow.open($scope.map, marker);
                        });
                        $scope.markers.push(marker);
                    }

                });
        }
        var i;
        for (i = 0; i < Locations.length; i++) {
            $scope.createMarker(Locations[i]);
        }


    };





    
    
})(angular);