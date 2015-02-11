TwitchOverlay.controller('OverlayController', ['$scope', function ($scope) {
    var config = require('./config/default.js');

    var socket = io('http://localhost:' + config.port);

    socket.on('update', function (data) {
        $scope.data = data;

        if(!$scope.$$phase) {
            $scope.$apply();
        }
    });
}]);