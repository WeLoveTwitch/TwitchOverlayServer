TwitchOverlay.controller('ActivityStreamController', ['$scope', 'TwitchOverlayServer', 'Tick', function ($scope, TwitchOverlayServer, Tick) {

    $scope.followers = [];

    // @TODO: refactor this into a service
    var knownFollowers = [];
    var newFollowers = [];

    var initialized = false;

    function loadFollowers() {
        TwitchOverlayServer.getFollowers(function (followers) {
            checkForNew(followers);
            $scope.followers = followers;
        });
    }

    function checkForNew(followers) {
        if(!initialized) {
            initialized = true;
            followers.forEach(function (follower) {
                knownFollowers.push(follower.name);
            });
            return;
        }
        followers.forEach(function (follower) {
            if(knownFollowers.indexOf(follower.name) !== -1) {
                return;
            }
            newFollowers.push(follower.name);
        });
    }

    $scope.checkNew = function(name) {
        return newFollowers.indexOf(name) > -1;
    };

    Tick.register(function () {
        loadFollowers();
    });

}]);