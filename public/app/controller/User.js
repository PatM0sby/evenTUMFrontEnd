(function (angular) {
    "use strict";

    angular.module('EvenTUMUser', [])
        .directive('login', login)
        .directive('register', register)
        .controller('UserCtrl', UserCtrl);

    UserCtrl.$inject = ['$scope', 'currUser'];

    function login () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'app/templates/User/login.html'
        };
    }

    function register () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'app/templates/User/register.html'
        };
    }

    
    function UserCtrl ($scope, currUser) {
        $scope.isLoggedin = currUser.getUser().username;
        $scope.login = {};
        $scope.register = {};

        $scope.logout = function () {
            currUser.logout();
            $scope.isLoggedin = false;
        };
        
        $scope.login.execute = function () {
            currUser.login($scope.login.username, $scope.login.password).then(function () {
                $scope.isLoggedin = true;
                $('#login-modal').modal('hide');
            }, function (response) {
                if (response.status == 400 || response.status == 401) {
                    $scope.alertDialog = {
                        msg: 'Wrong username or password.',
                        priority: 'danger',
                        visible: true,
                        selector: 'login'
                    };
                    console.log($scope.alertDialog, '\n');
                } else {
                    $scope.alertDialog = {
                        msg: 'An unknown error occured. please try again later.',
                        priority: 'danger',
                        visible: true,
                        selector: 'login'
                    };

                    console.log($scope.alertDialog, '\n');
                }
            });
        };

        $scope.register.execute = function () {
            if ($scope.register.password === $scope.register.repeatPassword) {
                currUser.register($scope.register.username, $scope.register.password).then(function () {
                    $scope.isLoggedin = true;
                    $('#register-modal').modal('hide');
                }, function (response) {
                    if (response.status == 400 || response.status == 401) {
                        $scope.alertDialog = {
                            msg: 'An unknown error occured. please try again later.',
                            priority: 'danger',
                            visible: true,
                            selector: 'register'
                        };
                        console.log($scope.alertDialog, '\n');
                    }
                });
            } else {
                $scope.alertDialog = {
                    msg: 'Passwords do not match!',
                    priority: 'danger',
                    visible: true,
                    selector: 'register'
                };
                console.log($scope.alertDialog, '\n');
            }
        };

        $scope.resetModal = function () {
            $scope.alertDialog.visible = false;
        };
    }

})(angular);