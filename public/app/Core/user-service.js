(function(){

    angular.module('User', [])
        .service('currUser', currUserService);

    currUserService.$inject = ['BASEURL', '$http', 'authService'];

    function currUserService(BASEURL, $http, authService) {

        this.register = register;
        this.login = login;
        this.loggedIn = authService.isAuthed;
        this.logout = authService.deleteToken;
        this.getUser = getUser;
        this.getToken = getToken;


        ////////////////

        function register (user, pass) {
            return $http.post(BASEURL + '/signup', {
                username: user,
                password: pass
            });
        }

        function login (user, pass) {
            return $http.post(BASEURL + '/login', {
                username: user,
                password: pass
            });
        }

        function getUser () {
            var token = this.getToken();
            var user = token ? authService.parseJwt(token).user : {};
            return user;
        }

        function getToken () {
            var token = authService.getToken();

            if (!token) {
                return false;
            }

            return token;
        }
    }

})();
