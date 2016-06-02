/**
 * Created by AndreasHorn on 02/06/16.
 */
var app = angular.module ("EvenTUM")

app.controller ("LocationListController", function($scope, $http){
    $scope.message = "Possible location";

    $http.get("http://localhost:3000/api/locations").success(function (response) {
        console.log(response);
        $scope.Location = response;
    }).error(function(err){
        $scope.error = err;
    });
})