TwitchOverlay.controller('OverlayController', ['$scope', '$rootScope', function ($scope, $rootScope) {

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

    $scope.connect = function() {
        loadSocketIO($scope.remote.host, $scope.remote.port);
    };

    if (typeof io !== 'undefined') {
        initializeSocket($scope.remote.host, $scope.remote.port);
    } else {
        $scope.showConnectionWindow = true;
    }

    function initializeSocket(host, port) {
        var socket = io('http://' + host + ':' + port);
        socket.on('update', function (data) {
            $scope.loaded = true;
            $scope.data = data;

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });

        socket.on('emotes', function(emotes) {
            // @TODO: refactor this into a service
            $rootScope.emotes = emotes;
        });
    }

    function loadSocketIO(host, port) {
        var promise = jQuery.getScript('http://' + host + ':' + port + '/socket.io/socket.io.js');
        promise.done(function (script) {

            (function() {
                eval(script);
            }).call(window);

            initializeSocket(host, port);
            $scope.showConnectionWindow = false;
        });
        promise.fail(function() {
            console.log('Failed to load socket.io');
        });
    }

    $scope.dragOptions = {
        container: 'body'
    };

    $scope.showDevTools = function() {
        win.showDevTools();
    };
}]);
