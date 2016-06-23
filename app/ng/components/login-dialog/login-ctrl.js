angular.module('Login', ['User'])
    .controller("login", function ($scope, currUser) {
        $scope.username = '';
        $scope.pwd = '';

        $scope.login = function () {
            currUser.login($scope.username, $scope.password).then(function () {
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
        }
    });
