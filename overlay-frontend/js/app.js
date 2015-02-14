var TwitchOverlay = angular.module('TwitchOverlay', ['ui.router']);

TwitchOverlay.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    'use strict';

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'OverlayController'
        })
}]);

TwitchOverlay.run(['$rootScope', 'Tick',function($rootScope, Tick) {

}]);