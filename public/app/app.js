var app = angular.module ("EvenTUM", ["ngRoute"])

app.config(function($routeProvider){
    $routeProvider
        .when("/Caterer", {
            templateUrl: "app/templates/Caterer/list.html",
            controller: "CatererListController"
        })
        .otherwise({redirectTo: '/Caterer'});
})
