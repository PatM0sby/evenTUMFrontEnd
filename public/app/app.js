var app = angular.module ("EvenTUM", ["ngRoute"])

app.config(function($routeProvider){
    $routeProvider
        /*.when("/Caterer", {
            templateUrl: "app/templates/Caterer/list.html",
            controller: "CatererListController"
        })*/
        .when("/Location", {
            templateUrl: "app/templates/Location/list.html",
            controller: "LocationListController"
        })
        .when("/Location/new", {
            templateUrl: "app/templates/Location/create.html",
            controller: "LocationCreateController"
        })
        .otherwise({redirectTo: '/Location'});

});
