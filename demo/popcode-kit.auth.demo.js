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
    .config(function(PCUserProvider, PCAuthProvider,
        $stateProvider, $urlRouterProvider,
        $locationProvider, Settings){

        PCUserProvider.config.endpoint = Settings.apiUrl+'users';
        PCAuthProvider.config.endpoint = Settings.apiUrl;

        $urlRouterProvider
            .otherwise('/');

        $locationProvider
            .html5Mode({
                enabled: true
            });

        $stateProvider
            // .state('main', {
            //     url: '/',
            //     templateUrl: '/main.html',
            //     controller: 'MainCtrl'
            // })
            .state('main', {
                url: '/',
                templateUrl: '/login.html',
                controller: 'LoginCtrl'
            });
    })
;
