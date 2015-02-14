var TwitchOverlay = angular.module('TwitchOverlay', ['ui.router']);

TwitchOverlay.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    'use strict';

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'configuration-frontend/templates/home.html',
            controller: 'HomeController'
        })
}]);

TwitchOverlay.run(['$rootScope', 'TwitchOverlayServer', function ($rootScope, TwitchOverlayServer) {
    TwitchOverlayServer.start();


    var gui = require('nw.gui');
    var win = gui.Window.get();
    var nativeMenuBar = new gui.Menu({type: "menubar"});
    try {
        nativeMenuBar.createMacBuiltin("TwitchOverlay");
        win.menu = nativeMenuBar;
    } catch (ex) {}

}]);