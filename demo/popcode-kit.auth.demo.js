'use strict';

angular.module('popcode-kit.demo.auth', [
    'popcode-kit.auth',
    'ui.router'
])
    .constant('Settings', {
        apiUrl: 'http://192.168.200.211/api/'
    })
    .controller('MainCtrl', function($scope, PCUser, $resource, Settings){
        $scope.users = PCUser.index();
    })
    .config(function(PCUserProvider,
        $stateProvider, $urlRouterProvider,
        $locationProvider, Settings){

        // console.log('PCUserProvider', PCUserProvider);
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
