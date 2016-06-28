(function(){

    angular.module('Auth', [])
        .service('authService', authService)
        .factory("authInterceptor", authInterceptor);

    function authService($window) {

        var self = this;

        self.isAuthed = isAuthed;
        self.parseJwt = parseJwt;
        self.saveToken = saveToken;
        self.getToken = getToken;
        self.deleteToken = deleteToken;

        function saveToken(t) {
            $window.localStorage['jwtToken'] = t;
        }

        function getToken() {
            return $window.localStorage['jwtToken'];
        }

        function deleteToken() {
            console.log('Logout');
            $window.localStorage.removeItem('jwtToken');
        }

        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        }

        function isAuthed() {

            var token = self.getToken();
            return !!token;
        }
    }

    function authInterceptor(BASEURL, authService) {

        function req(config){
            // automatically attach Authorization header
            if(config.url.indexOf(BASEURL) === 0 && authService.isAuthed()) {
                var token = authService.getToken();
                config.headers.Authorization = 'JWT ' + token;
            }

            return config;

        }

        function res(res){

            // If a token was sent back, save it
            if(res && res.config.url.indexOf(BASEURL) === 0 && res.data.token) {
                authService.saveToken(res.data.token);
            }

            return res;
        }

        return {
            request: req,
            response: res
        };
    }

})();
