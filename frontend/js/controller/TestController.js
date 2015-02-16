TwitchOverlay.controller('TestController', ['$scope', 'TwitchOverlayServer', 'Followers', function($scope, TwitchOverlayServer, Followers) {

    $scope.followerName = TwitchOverlayServer.getConfig('followerName');

    $scope.addFollower = function() {
        var randomId = Math.floor((Math.random() * 10) + 1);

        var payload = {
            user: {
                _id: randomId,
                display_name: $scope.followerName,
                name: $scope.followerName.toLowerCase(),
                addedToDatabase: new Date().getTime()
            }
        };

        TwitchOverlayServer.getServer().getModule('twitch')._saveFollowers([payload]);
    };

}]);
