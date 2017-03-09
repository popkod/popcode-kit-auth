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

        $scope.save = function(){
            PCUser.save($scope.user, $scope.users)
                .then(function(result){
                    $scope.user = {};
                });
        };

        $scope.edit = function(user){
            $scope.user = angular.copy(user);
        };

    })
    .config(function(PCUserProvider,
        $stateProvider, $urlRouterProvider,
        $locationProvider, Settings){

        PCUserProvider.config.endpoint = Settings.apiUrl+'users';

        $urlRouterProvider
            .otherwise('/');

        $locationProvider
            .html5Mode({
                enabled: true
            });

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: '/main.html',
                controller: 'MainCtrl'
            });
    })
;
