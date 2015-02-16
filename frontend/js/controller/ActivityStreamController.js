TwitchOverlay.controller('ActivityStreamController', ['$scope', 'Followers', function ($scope, Followers) {

    $scope.followers = Followers.get();

    $scope.checkNew = function(follower) {
        var now = new Date().getTime();
        return follower.addedToDatabase + 1000 * 60 * 10 > now;
    };

}]);