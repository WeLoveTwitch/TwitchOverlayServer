var TwitchOverlay = angular.module('TwitchOverlay', ['ui.router', 'ngAnimate']);

TwitchOverlay.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    'use strict';

    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
        .state('dashboard', {
            headline: 'Dashboard',
            url: '/dashboard',
            templateUrl: 'frontend/templates/dashboard.html',
            controller: 'DashboardController'
        })
        .state('design', {
            headline: 'Design',
            url: '/design',
            templateUrl: 'frontend/templates/design.html',
            controller: 'DesignController'
        })
}]);

TwitchOverlay.run(['$rootScope', 'TwitchOverlayServer', 'Tick', '$state', function ($rootScope, TwitchOverlayServer, Tick, $state) {
    TwitchOverlayServer.start();


    $rootScope.getCurrentState = function(key) {
        if(!key) return $state.current;
        return $state.current[key];
    };


    var gui = require('nw.gui');
    var win = gui.Window.get();
    var nativeMenuBar = new gui.Menu({type: "menubar"});
    try {
        nativeMenuBar.createMacBuiltin("TwitchOverlay");
        win.menu = nativeMenuBar;
    } catch (ex) {}

}]);
