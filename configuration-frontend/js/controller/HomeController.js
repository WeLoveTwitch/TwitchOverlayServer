TwitchOverlay.controller('HomeController', ['$scope', 'TwitchOverlayServer', function($scope, TwitchOverlayServer) {

    var gui = require('nw.gui');
    $scope.win = null;
    $scope.server = TwitchOverlayServer;

    $scope.openOverlay = function() {
        $scope.win = gui.Window.open('./overlay-frontend/index.html', {
            position: 'center',
            width: 1280,
            height: 720,
            "toolbar": false,
            "frame": false
        });
    };

    $scope.closeOverlay = function() {
        if(!$scope.win) return false;

        $scope.win.close();
        $scope.win = null;
    }

}]);