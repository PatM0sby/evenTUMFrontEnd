(function (angular) {
    "use strict";

    angular.module ('EvenTUM', [
            // vendor
            'ngRoute',
            'ngResource',

            // core
            'Directives',
            'Auth',
            'User',
            'TestData',

            // controller
            'EvenTUMUser',
            'EvenTUMLocation',
            'EvenTUMCaterer',
            'EvenTUMInvitation',
            'EvenTUMHome',
            'EvenTUMOffer',
            'EvenTUMEvent'

        ])
        .constant('BASEURL', 'http://localhost:3000')
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$httpProvider'];
    run.$inject = ['$rootScope', '$location', 'currUser'];

    function config ($routeProvider, $httpProvider) {
        $routeProvider.otherwise({redirectTo: '/'});

        /*angular.extend($resourceProvider.defaults.actions, {

            update: {
                method: 'PUT'
            }

        });*/

         //$httpProvider.interceptors.push('reqErrInterceptor');
        //auth interceptor
        $httpProvider.interceptors.push('authInterceptor');

    }

    function run ($rootScope, $location, currUser) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (!currUser.getToken() && next.templatUrl !== 'app/templates/home/home.html') {
                $location.path('/');
            }
        });
    }

})(angular);