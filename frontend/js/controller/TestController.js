TwitchOverlay.controller('TestController', ['$scope', 'TwitchOverlayServer', function($scope, TwitchOverlayServer) {

    $scope.followerName = TwitchOverlayServer.getConfig('followerName');

    $scope.addFollower = function() {
        var randomId = Math.floor((Math.random() * 10000) + 1);

        var payload = {
            user: {
                _id: randomId,
                type: 'follower',
                fake: true,
                display_name: $scope.followerName,
                name: $scope.followerName.toLowerCase(),
                addedToDatabase: new Date().getTime()
            }
        };

        TwitchOverlayServer.getServer().getModule('twitch')._saveFollowers([payload], true);
    };

    $scope.cleanUp = function() {
        TwitchOverlayServer.getServer().getModule('twitch').cleanUpFollowers();
    };

}]);
