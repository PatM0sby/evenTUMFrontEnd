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
        .otherwise({redirectTo: '/Location'});

})
