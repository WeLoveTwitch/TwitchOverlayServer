TwitchOverlay.controller('ConfigurationController', ['$scope', 'TwitchOverlayServer', function($scope, TwitchOverlayServer) {

    $scope.topic = TwitchOverlayServer.getConfig('topic');
    $scope.followerTarget = TwitchOverlayServer.getConfig('followerTarget');
    $scope.subline = TwitchOverlayServer.getConfig('subline');

    $scope.save = function() {
        TwitchOverlayServer.setConfig('topic', $scope.topic);
        TwitchOverlayServer.setConfig('followerTarget', $scope.followerTarget);
        TwitchOverlayServer.setConfig('subline', $scope.subline);
    };

}]);