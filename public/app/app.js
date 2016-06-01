var app = angular.module ("EvenTUM", [])

app.controller ("HomeController", function($scope, $http){
    $scope.message = "Possible caterer";
    $scope.caterer = {
        "offerId" :  10030019,
        "name" : "Name",
        "descripton" : "This is an description lorem ipsum dolorem sit",
        "pricePerPerson" : 19.50,
        "kitchen" : "Chinese",
        "selection" : "Snacks",
        "vein" : ["chicken", "pig", "nut", "lactose"],
        "user" : "90392390jif2j0c2mom2m0"
    };

    /*$http.get("http://localhost:3000/Caterer").success(function (response) {
        $scope.Caterer = response;
    }).error(function(err){
       $scope.error = err;
    });*/
});