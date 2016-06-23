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


        ////////////////

        function register(user, pass) {
            return $http.post(BASEURL + '/signup', {
                username: user,
                password: pass
            });
        }

        function login(user, pass) {
            return $http.post(BASEURL + '/login', {
                username: user,
                password: pass
            });
        }

        function getUser() {
            var token = authService.getToken();
            return token ? authService.parseJwt(token).user : {};
        }
    }

})();
