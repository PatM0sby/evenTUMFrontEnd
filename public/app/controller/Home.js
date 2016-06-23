/**
 * Created by AndreasHorn on 15/06/16.
 */
/**
 * Refaktoring, damit Dateien minifiziert werden können und trotzdem Funktionalität erhalten bleibt
 */
(function (angular) {
    "use strict";

    /**
     * Defining section for controllers, directives and more
     *
     * TODO: adding delete and update functionality
     */
    angular.module("EvenTUMHome", ["ngRoute"])
        .config(config)
        .directive('login', login)
        .directive('register', register)
        .controller('LoginCtrl', LoginCtrl)
        .controller('RegisterCtrl', RegisterCtrl);

    // dependencies
    config.$inject = ["$routeProvider"];
    LoginCtrl.$inject = ['$scope', 'currUser'];
    RegisterCtrl.$inject = ['$scope', 'currUser'];

    // functionality
    function config ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "app/templates/Home/home.html"
            });
    }
    
    function login () {
        return {
            restrict: 'A',
            scope: {},
            replace: true,
            templateUrl: 'app/templates/Home/login.html',
            controller: 'LoginCtrl'
        };
    }

    function register () {
        return {
            restrict: 'A',
            scope: {},
            replace: true,
            templateUrl: 'app/templates/Home/register.html',
            controller: 'RegisterCtrl'
        };
    }


    function LoginCtrl ($scope, currUser) {
        $scope.login = {};

        $scope.login.execute = function () {
            currUser.login($scope.login.username, $scope.login.password).then(function () {
                $('#login-modal').modal('hide');
            }, function (response) {
                if (response.status == 400 || response.status == 401) {
                    $scope.alertDialog = {
                        msg: 'Wrong username or password.',
                        priority: 'danger',
                        visible: true
                    };
                } else {
                    $scope.alertDialog = {
                        msg: 'An unknown error occured. please try again later.',
                        priority: 'danger',
                        visible: true
                    };
                }
            });
        };
    }

    function RegisterCtrl ($scope, currUser) {
        $scope.register = {};

        $scope.register.execute = function () {
            if ($scope.register.password === $scope.register.repeatPassword) {
                currUser.register($scope.register.username, $scope.register.password).then(function () {
                    $('#register-modal').modal('hide');
                }, function (response) {
                    debugger;
                    if (response.status == 400 || response.status == 401) {
                        $scope.alertDialog = {
                            msg: 'An unknown error occured. please try again later.',
                            priority: 'danger',
                            visible: true
                        };
                    }
                });
            } else {
                $scope.alertDialog = {
                    msg: 'Passwords do not match!',
                    priority: 'danger',
                    visible: true
                };
            }
        };
    }

})(angular);