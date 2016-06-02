var app = angular.module ("EvenTUM");

    app.controller ("LocationCreateController", function($scope, $http, $location){
        $scope.Loc = {};

        console.log("create controller active");
        $scope.createLoc = function(){
            $http.post("http://localhost:3000/api/locations", $scope.Loc)
                .success(function(response){
                    $location.url("/Location")
                });
        }
    });