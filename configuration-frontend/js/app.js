var TwitchOverlay = angular.module('TwitchOverlay', ['ui.router']);

TwitchOverlay.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    'use strict';

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'configuration-frontend/templates/home.html',
            controller: 'HomeController'
        })
}]);

TwitchOverlay.run(['$rootScope', 'TwitchOverlayServer', function($rootScope, TwitchOverlayServer) {
    TwitchOverlayServer.start();
}]);