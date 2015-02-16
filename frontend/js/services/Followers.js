TwitchOverlay.service('Followers', ['Tick', 'TwitchOverlayServer', function (Tick, TwitchOverlayServer) {

    var followers = [];

    function loadFollowers() {
        TwitchOverlayServer.getFollowers(function (followersFromBackend) {
            followers.length = 0;
            followersFromBackend.forEach(function(follower) {
                followers.push(follower);
            });
        });
    }

    Tick.register(function () {
        loadFollowers();
    });

    return {
        get: function () {
            return followers;
        }
    }
}]);