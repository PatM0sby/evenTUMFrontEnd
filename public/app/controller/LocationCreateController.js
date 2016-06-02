var app = angular.module ("EvenTUM");

    app.controller ("LocationCreateController", function($scope, $http, $location){
        $scope.Loc = {};

        $scope.createLoc = function(){
            $http.post("http://localhost:3000/api/locations", $scope.Loc)
                .success(function(responde){
                    $location.url("/locations")
                });
        }
    });