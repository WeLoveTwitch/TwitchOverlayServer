TwitchOverlay.controller('DashboardController', ['$scope', 'TwitchOverlayServer', function($scope, TwitchOverlayServer) {

    var gui = require('nw.gui');
    $scope.server = TwitchOverlayServer;

}]);
