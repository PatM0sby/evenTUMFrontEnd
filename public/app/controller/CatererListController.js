/**
 * Created by FlorianStrauß on 01/06/16.
 */
var app = angular.module ("EvenTUM")

app.controller ("CatererListController", function($scope, $http){
    $scope.message = "Possible caterer";

    $http.get("http://localhost:3000/Caterer").success(function (response) {
        $scope.Caterer = response;
    }).error(function(err){
        $scope.error = err;
    });
})