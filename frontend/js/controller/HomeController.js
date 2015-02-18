TwitchOverlay.controller('HomeController', ['$scope', 'TwitchOverlayServer', function($scope, TwitchOverlayServer) {

    var gui = require('nw.gui');
    console.log('TwitchOverlayServer');
    $scope.server = TwitchOverlayServer;

}]);
