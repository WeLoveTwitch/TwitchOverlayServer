TwitchOverlay.controller('ActivityStreamController', ['$scope', 'Activities', function ($scope, Activities) {

    $scope.$watch(function () {
        return Activities.get();
    }, function (activities) {
        $scope.activities = activities;
    });

    $scope.checkNew = function(activity) {
        var now = new Date().getTime();
        return activity.addedToDatabase + 1000 * 60 * 10 > now;
    };

}]);
