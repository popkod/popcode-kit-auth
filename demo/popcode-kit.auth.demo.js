'use strict';

angular.module('popcode-kit.demo.auth', [
    'popcode-kit.auth',
    'ui.router',
    'ui.bootstrap'
])
    .constant('Settings', {
        apiUrl: 'http://192.168.200.211/api/'
    })
    .controller('MainCtrl', function($scope, PCUser, $resource, Settings, $q, $uibModal){
        $scope.users = PCUser.index();

        var confirmStuff = function(text){
            return $uibModal.open({
                templateUrl: '/confirm.html',
                controller: function($scope){
                    $scope.text = text;
                },
                controllerAs: '$ctrl',
                resolve: {
                    text: function(){return text;}
                }
            }).result;
        };

        $scope.delete = function(user){
            confirmStuff('Are you sure?').then(function(){
                PCUser.delete(user, $scope.users);
            });
        };

        $scope.save = function($form){
            // PCUser.save($scope.user, $scope.users, $form)
            //     .then(function(result){
            //         $scope.user = {};
            //     })
            //     .catch(function(response){
            //         console.log('b', $form);
            //     });
            PCUser.save($scope.user, $form)
                .then(function(result){
                    $scope.user = {};
                })
                .catch(function(response){
                    console.log('b', $form);
                });
        };

        $scope.edit = function(user){
            $scope.user = angular.copy(user);
        };

    })
    .controller('LoginCtrl', function($scope, PCAuth){
        PCAuth.me.then(function(me){
            $scope.me = me;
            console.log('Me', $scope.me);
            console.log('Has role 1?', $scope.me.hasRole(1));
            console.log('Has role 2?', $scope.me.hasRole(2));
            console.log('Has role 1|2?', $scope.me.hasRole([1,2]));
            console.log('Has role 3|4?', $scope.me.hasRole([3,4]));
        });
        $scope.login = function($form){
            PCAuth.login($scope.user, $form)
                .then(function(data){
                    console.log('current user', PCAuth.me);
                })
                .catch(function(response){
                    console.log('Failed to login', response);
                });
        };
    })
    // .provider('httpHandlers', function TestProvider(){
    //     var _state;
    //     this.test = function(){
    //         console.log('test handler');
    //         _state.go('login');
    //     };
    //     this.$get = function($state){
    //         console.log('initiating httpHandlersProvider');
    //         _state = $state;
    //         return new TestProvider();
    //     };
    // })
    .config(function(PCUserProvider, PCAuthProvider, PCAuthInterceptorProvider,
        $stateProvider, $urlRouterProvider,
        $locationProvider, Settings, $injector){

        var state;

        PCUserProvider.config.endpoint = Settings.apiUrl+'users';
        PCAuthProvider.config.endpoint = Settings.apiUrl;


        PCAuthInterceptorProvider.config.responseErrorHandlers[401] = function(response, _$injector){
            console.log('Got 401; redirecting to login');
            // $injector.get('$state');


                var $state = _$injector.get('$state');
                console.log('ASDF $state', $state);
                console.log($injector === _$injector);

            // (state || (state = $injector.get('$state')))
            $state
            // $stateProvider
                .go('login');

        };
        PCAuthInterceptorProvider.config.responseErrorHandlers[403] = function(response){
            console.log('Got 403');
        };

        $urlRouterProvider
            .otherwise('/');

        // $locationProvider
        //     .html5Mode({
        //         enabled: true
        //     });

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: '/main.html',
                controller: 'MainCtrl'
            })
            .state('route1', {
                url: '/route1',
                templateUrl: '/main.html',
                controller: 'MainCtrl',
                restrict: 1
            })
            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'LoginCtrl'
            })
            ;
    })
    .run(function($state){
        window.$state = $state;
    })
;
