'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ui.router', 'myApp.movies', 'templates', 'ncy-angular-breadcrumb', 'ngMaterial', 'ngMessages'])

    .config(["$stateProvider", "$urlRouterProvider", "$mdIconProvider", "$resourceProvider", "$httpProvider", "$breadcrumbProvider", function($stateProvider, $urlRouterProvider, $mdIconProvider, $resourceProvider, $httpProvider, $breadcrumbProvider) {

        // For any unmatched url, redirect to /movies
        $urlRouterProvider.otherwise("/movies");


        $stateProvider
            .state('root', {

                abstract: true,
                templateUrl: "views/root/root.html"
            });

        $mdIconProvider
            .iconSet('content', 'libs/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg')
            .iconSet('action', 'libs/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg')
            .iconSet('editor', 'libs/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg')
            .iconSet('navigation', 'libs/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg');

        //this overrides the defaults actiosn for all $resources
        angular.extend($resourceProvider.defaults.actions, {

            update: {
                method: "PUT"
            }

        });

        $httpProvider.interceptors.push('reqErrInterceptor');
        //auth interceptor
        $httpProvider.interceptors.push('authInterceptor');

        $breadcrumbProvider.setOptions({
            templateUrl:"components/breadcrumbs/breadcrumbs.html",
        });

    }]);
angular.module('myApp.movies', ['ngResource', 'ui.router'])

.config(["$stateProvider", "$urlRouterProvider", "movieDetailsState", "movieListState", function ($stateProvider,   $urlRouterProvider, movieDetailsState, movieListState) {
    $stateProvider

        .state('movies', {

            // With abstract set to true, that means this state can not be explicitly activated.
            // It can only be implicitly activated by activating one of its children.
            abstract: true,
            parent: 'root',

            // This abstract state will prepend '/movies' onto the urls of all its children.
            url: '/movies',

            // since we have views we do not need to define a template here
            //template: '<div ui-view></div>',

            // Use `resolve` to resolve any asynchronous controller dependencies
            // *before* the controller is instantiated. In this case, since contacts
            // returns a promise, the controller will wait until contacts.all() is
            // resolved before instantiation. Non-promise return values are considered
            // to be resolved immediately.
            //resolve: {
            //    movies: ['contacts',
            //        function( contacts){
            //            return contacts.all();
            //        }]
            //},

        })


        // Using a '.' within a state name declares a child within a parent.
        // So you have a new state 'list' within the parent 'movies' state.
        .state(movieListState.name, movieListState.options)

        .state(movieDetailsState.name, movieDetailsState.options);

}]);






(function(){

    authInterceptor.$inject = ["BASEURL", "auth"];
    angular.module('myApp')
        .factory("authInterceptor", authInterceptor);

    function authInterceptor(BASEURL, auth) {

        function req(config){
            // automatically attach Authorization header
            if(config.url.indexOf(BASEURL) === 0 && auth.isAuthed()) {
                var token = auth.getToken();
                config.headers.Authorization = 'JWT ' + token;
            }

            return config;

        }

        function res(res){

            // If a token was sent back, save it
            if(res && res.config.url.indexOf(BASEURL) === 0 && res.data.token) {
                auth.saveToken(res.data.token);
            }

            return res;

        }

        return {
            request: req,
            response: res
        };
    }

})();
(function(){

    authService.$inject = ["$window"];
    angular.module('myApp')
        .service('auth', authService);

    function authService($window) {

        var self = this;
        this.token;


        this.isAuthed = isAuthed;
        this.parseJwt = parseJwt;
        this.saveToken = saveToken;
        this.getToken = getToken;
        this.deleteToken = deleteToken;

        function saveToken(t) {
            $window.localStorage['jwtToken'] = t;
        }

        function getToken() {
            return $window.localStorage['jwtToken'];
        }

        function deleteToken() {
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

})();

(function(){

    currUserService.$inject = ["BASEURL", "$http", "auth"];
    angular.module('myApp')
        .service('currUser', currUserService);

    function currUserService(BASEURL, $http, auth) {

        this.register = register;
        this.login = login;
        this.loggedIn = auth.isAuthed;
        this.logout = auth.deleteToken;
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
            var token = auth.getToken();
            return token? auth.parseJwt(token).user : {};
        }
    }

})();

//taken from http://stackoverflow.com/a/31671397/3200478

angular.module('myApp')
    .directive("compareTo", function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    });

/**
 * One can implmenet a config service if configuration more complex than constants is required
 */
angular.module('myApp')
    .constant("BASEURL", "http://localhost:3000");
angular.module('myApp.movies')
    .controller('CreateMovieCtrl', ["$scope", "Movie", "$mdDialog", "$rootScope", "currUser", function($scope, Movie, $mdDialog, $rootScope, currUser) {

        $scope.movie = new Movie();
        $scope.ratings = [{
                abbr: "G",
                short_desc: "G – General Audiences",
                long_desc: "All ages admitted. Nothing that would offend parents for viewing by children."
            },
            {
                abbr: "PG",
                short_desc: "PG – Parental Guidance Suggested",
                long_desc: "Some material may not be suitable for children. Parents urged to give \"parental guidance\". May contain some material parents might not like for their young children."
            },
            {
                abbr: "PG-13",
                short_desc: "PG-13 – Parents Strongly Cautioned",
                long_desc: "Some material may be inappropriate for children under 13. Parents are urged to be cautious. Some material may be inappropriate for pre-teenagers."
            },
            {
                abbr: "R",
                short_desc: "R – Restricted",
                long_desc: "Under 17 requires accompanying parent or adult guardian. Contains some adult material. Parents are urged to learn more about the film before taking their young children with them."
            },
            {
                abbr: "NC-17",
                short_desc: "NC-17 – Adults Only",
                long_desc: "No One 17 and Under Admitted. Clearly adult. Children are not admitted."
            }];
        $scope.years;


        //init
        (function(){

            var r = [];
            var now = new Date().getFullYear();
            for (var i = 1892; i <= now; i++) {
                r.push(i);
            }
            $scope.years = r;
            $scope.movie.year = now;
        })();


        $scope.save = function() {
            $scope.movie.user = currUser.getUser()._id;
            $scope.movie.$save()
                .then(function(){
                    $rootScope.$broadcast('movieCreated', $scope.movie);
                    $mdDialog.hide(true);
                }).catch(function(){
                    $mdDialog.hide(false);
                });
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

}]);
'use strict';

angular.module('myApp')

/*
    a generic directive for editable items.

    model:


     */
    .directive('mvEditable', function() {
        return {
            restrict: 'AE',
            transclude:true,
            scope: {
                model: "=",
                saveM: "&onSave",
                cancelM: "&onCancel"
            },

            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                // this applies the directive' scope to the scope of the transcluded html.
                // further info: http://angular-tips.com/blog/2014/03/transclusion-and-scopes/
                transcludeFn(scope, function(transcludeHtml){ iElement.append(transcludeHtml); });
            },
            controller: ["$scope", "$timeout", function($scope, $timeout){


                $scope.editing = false;
                $scope.startEditing = startEditing;
                $scope.save = save;
                $scope.cancel = cancel;

                //init
                resetValue();


                $scope.$watch('model', function(){
                    if (!$scope.editing) {
                        resetValue()
                    }
                });


                ///////////////////////////////////

                function startEditing() {
                    $scope.editing = true;
                };

                function save(){
                    $scope.editing = false;
                    var changed = ($scope.model != $scope.value);
                    $scope.model = angular.copy($scope.value);

                    //run a digest cycle to update $scope.model before invoking saveM method
                    $timeout( function(){ $scope.saveM({changed:changed}); });
                };

                function cancel() {
                    $scope.editing = false;
                    resetValue();
                    //same as obove. invoke digest cycle
                    $timeout( function(){ $scope.cancelM(); });

                };

                function resetValue() {
                    $scope.value = angular.copy($scope.model);
                }

            }]
        };
    });

angular.module('myApp')
    .controller("login", ["$scope", "currUser", "$mdDialog", function ($scope, currUser, $mdDialog) {
        $scope.username = '';
        $scope.pwd = '';
        $scope.errorText = '';

        $scope.login = login;
        $scope.cancel = cancel;

        function login() {
            currUser.login($scope.username, $scope.password).then(function () {
                $mdDialog.hide();
            }, function (response) {
                if (response.status == 400 || response.status == 401) {
                    $scope.errorText = "Wrong username or password.";
                } else {
                    $scope.errorText = "An unknown error occured. please try again later.";
                }
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }]);

'use strict';

angular.module('myApp.movies')

    .directive('mvMovieCard', function() {
        return {
            restrict: 'A',
            scope: {
                movie: '='
            },
            templateUrl: 'components/movie-card/movie-card.html'
        };
    });

'use strict';

angular.module('myApp.movies')

    .factory('Movie', ["$resource", function( $resource) {
        return $resource('http://localhost:3000/api/movies/:movieId', {movieId: '@_id'});

    }]);
angular.module('myApp')
    .controller("register", ["$scope", "currUser", "$mdDialog", function ($scope, currUser, $mdDialog) {
        $scope.username = '';
        $scope.pwd = '';
        $scope.pwdConfirm
        $scope.errorText = '';

        $scope.register = register;
        $scope.cancel = cancel;

        function register() {
            currUser.register($scope.username, $scope.pwd).then(function () {
                $mdDialog.hide();
            }, function (response) {
                debugger;
                if (response.status == 400 || response.status == 401) {
                    $scope.errorText = "An unknown error occured. please try again later.";
                }
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }]);

(function () {

    reqErrInterceptor.$inject = ["BASEURL", "$injector", "$q"];
    angular.module('myApp')
        .factory("reqErrInterceptor", reqErrInterceptor);

    function reqErrInterceptor(BASEURL, $injector, $q) {


        return {
            responseError: responseError
        };

        //////////////////////////////

        function responseError(rej) {
            if ([-1, 404].indexOf(rej.status) !== -1) {
                showAlert({title: 'Connection Error', msg: 'Could not reach the server. Try again later'});
            } else {
                showAlert({title: 'Unknown Error', msg: 'Unknown error. Try again later'});
            }

            return $q.reject(rej);
        }

        function showAlert(opt) {
            //inject manually to resolve circular dependency error
            var $mdDialog = $injector.get('$mdDialog');
            var alert = $mdDialog.alert({
                title: opt.title,
                textContent: opt.msg,
                ok: 'Close'
            });

            $mdDialog.show(alert)

        }

    }

})();
angular.module('myApp')
    .directive('mvToolbar', function() {
        return {
            restrict: "A",
            templateUrl: "components/toolbar/toolbar.html",
            controller: ["$scope", "currUser", "$mdDialog", "$mdMedia", "$mdToast", function($scope, currUser, $mdDialog, $mdMedia, $mdToast) {

                $scope.user = null;


                $scope.showLoginDialog = showLoginDialog;
                $scope.showSignupDialog = showSignupDialog;
                $scope.logout = logout;

                $scope.$watch(function(){
                    return currUser.loggedIn();
                }, function(loggedIn){
                    $scope.loggedIn = loggedIn;
                    if (loggedIn && !$scope.user) {
                        $scope.user = currUser.getUser();
                    }
                });



                /////////////////////

                function showLoginDialog(){
                    var useFullScreen = $mdMedia('xs');
                    $mdDialog.show({
                        controller: 'login',
                        templateUrl: 'components/login-dialog/login-dialog.html',
                        clickOutsideToClose:true,
                        fullscreen: useFullScreen
                    });
                };
                function showSignupDialog(){
                    var useFullScreen = $mdMedia('xs');
                    $mdDialog.show({
                        controller: 'register',
                        templateUrl: 'components/register-dialog/register-dialog.html',
                        clickOutsideToClose:true,
                        fullscreen: useFullScreen
                    });
                };

                function logout(){
                    currUser.logout();
                }

                function showSimpleToast(txt){
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(txt)
                            .position('bottom right')
                            .hideDelay(3000)

                    );
                }
            }]
        }
    });
'use strict';

angular.module('myApp.movies')

    .constant('movieDetailsState', {
        name: 'movies.detail',
        options: {
            url: '/{movieId}',

            views: {
                "content@root": {
                    templateUrl: 'views/detail/movie-detail.html',
                    controller: 'MovieDetailCtrl'
                }
            },

            resolve: {
                //we abuse the resolve feature for eventual redirection
                redirect: function($state, $stateParams, Movie, $timeout, $q){
                    var mid = $stateParams.movieId;
                    if (!mid) {
                        //timeout because the transition cannot happen from here
                        $timeout(function(){
                            $state.go("movies.list");
                        });
                        return $q.reject();
                    }
                }
            },
            ncyBreadcrumb: {
                // a bit ugly (and not stable), but ncybreadcrumbs doesn't support direct access
                // to a view controller yet if there are multiple views
                label: "{{$$childHead.$$childHead.movie.title}}",
                parent: "movies.list"
            }

        }
    })
    .controller('MovieDetailCtrl', ["$scope", "Movie", "$mdToast", "$mdDialog", "$stateParams", "$state", "currUser", function($scope, Movie, $mdToast, $mdDialog, $stateParams, $state, currUser) {

        $scope.movie = Movie.get({movieId: $stateParams.movieId});

        $scope.mayDelete;
        $scope.mayEdit = currUser.loggedIn();
        $scope.deleteMovie = deleteMovie;
        $scope.updateMovie = updateMovie;
        $scope.cancelEditingMovie = function(){ showSimpleToast("Editing cancelled"); }

        $scope.movie.$promise.then(function(){
            $scope.mayDelete = $scope.movie.user && $scope.movie.user == currUser.getUser()._id;
        });

        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            if (!loggedIn) {
                $scope.mayDelete = false;
                $scope.mayEdit = false;
            } else {
                $scope.mayEdit = true;
                $scope.mayDelete = $scope.movie.user == currUser.getUser()._id;
            }
        });

        ////////////////////


        function updateMovie(changed) {

            if (!changed) {
                showSimpleToast("no change");
                return;
            }

            $scope.movie.$update().then(function(updated){
                $scope.movie = updated;
                showSimpleToast("update successfull");
            }, function(){
                showSimpleToast("error. please try again later");
            });
        }

        function deleteMovie(ev) {

            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this movie?')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('Abort');

            var toastText;
            $mdDialog.show(confirm).then(function() {
                return $scope.movie.$remove().then(function() {
                    return $state.go('movies.list');
                }).then(function(){
                    showSimpleToast('Movie deleted successfully');
                }, function() {
                    showSimpleToast("Error. Try again later");
                });
            }, function() {
                showSimpleToast("delete aborted");
            })
        }

        function showSimpleToast(txt) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        }


    }]);
'use strict';

angular.module('myApp.movies')

    .constant('movieListState', {
        name: 'movies.list',
        options: {

            // Using an empty url means that this child state will become active
            // when its parent's url is navigated to. Urls of child states are
            // automatically appended to the urls of their parent. So this state's
            // url is '/movies' (because '/movies' + '').
            url: '',

            // IMPORTANT: Now we have a state that is not a top level state. Its
            // template will be inserted into the ui-view within this state's
            // parent's template; so the ui-view within contacts.html. This is the
            // most important thing to remember about templates.
            views: {
                'content@root': {
                    templateUrl: 'views/list/movie-list.html',
                    controller: 'MovieListCtrl',
                },
                'outside@root': {
                    templateUrl: 'views/list/movie-list-buttons.html',
                    controller: 'movieListButtonCtrl'
                }
            },

            ncyBreadcrumb: {
                label: "Movies"
            }

        }

    })

    .controller('MovieListCtrl', ["$scope", "Movie", function($scope, Movie) {
        $scope.movies = Movie.query();
        console.log($scope.movies);

        $scope.$on('movieCreated', function(ev, movie){
            $scope.movies.push(movie);
        });


    }])

    .controller('movieListButtonCtrl', ["$scope", "$mdMedia", "$mdDialog", "$mdToast", "currUser", function($scope, $mdMedia, $mdDialog, $mdToast, currUser){

        $scope.createMovieDialog = createMovieDialog;
        $scope.authed = false;

        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            $scope.authed = loggedIn;
        });

        ////////////////////////////////////

        function createMovieDialog(ev) {
            var useFullScreen = ( $mdMedia('xs'));
            $mdDialog.show({
                    controller: "CreateMovieCtrl",
                    templateUrl: 'components/create-movie/create-movie.html',
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen,
                    preserveScope:true
                })
                .then(function(answer) {

                    if (answer) {
                        showSimpleToast('Movie saved successfully');
                    } else {
                        showSimpleToast('An Error occured!');
                    }
                }, function() {
                    showSimpleToast('Movie creation cancelled');
                });

        }

        function showSimpleToast(txt){
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)

            );
        }
    }]);