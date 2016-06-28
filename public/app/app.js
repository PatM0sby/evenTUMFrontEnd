(function (angular) {
    "use strict";

    angular.module ('EvenTUM', [
            // vendor
            'ngRoute',

            // core
            'Directives',
            'Auth',
            'User',

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
        .config(config);

    config.$inject = ['$routeProvider', '$httpProvider'];

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
})(angular);