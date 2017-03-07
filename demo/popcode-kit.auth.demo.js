'use strict';

angular.module('popcode-kit.demo.auth', [
    'popcode-kit.auth',
    'ui.router'
])
    .controller('MainCtrl', function($scope, PCUser){
        $scope.users = PCUser.index();
    })
    .config(function(PCUserProvider,
        $stateProvider, $urlRouterProvider,
        $locationProvider){

        // console.log('PCUserProvider', PCUserProvider);
        PCUserProvider.config.endpoint = 'http://192.168.200.211/api/users';

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
