TwitchOverlay.controller('OverlayController', ['$scope', '$rootScope', 'Socket', function ($scope, $rootScope, Socket) {

    var gui = require('nw.gui');
    var win = gui.Window.get();

    // add system tray icon
    // hide window by position it somewhere where the user doesn't see it
    // add hide and show option to system tray icon

    $scope.showConnectionWindow = false;
    $scope.loaded = false;

    $scope.remote = {
        host: '127.0.0.1',
        port: '1337'
    };

    Socket.on('update', function(data) {
        $scope.loaded = true;
        $scope.data = data;
    });

    $scope.connect = function() {
        Socket.connect($scope.remote.host, $scope.remote.port, function() {
			$scope.loaded = true;
			$scope.showConnectionWindow = false;
		});
    };

    if(!Socket.isConnected()) {
        $scope.showConnectionWindow = true;
    }

    $scope.dragOptions = {
        container: 'body'
    };

    $scope.showDevTools = function() {
        win.showDevTools();
    };
}]);
