TwitchOverlay.controller('ActivityStreamController', ['$scope', 'TwitchOverlayServer', 'Tick', function($scope, TwitchOverlayServer, Tick) {

    $scope.followers = [];

    function loadFollowers() {
        TwitchOverlayServer.getFollowers(function(follower) {
            $scope.followers = follower;
        });
    }

    Tick.register(function() {
        loadFollowers();
    });

}]);