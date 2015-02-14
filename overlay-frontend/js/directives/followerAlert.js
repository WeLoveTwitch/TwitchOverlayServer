TwitchOverlay.directive('followerAlert', ['Tick', function(Tick) {
    return {
        restrict: 'E',
        scope: {
            followers: '='
        },
        templateUrl: 'templates/directives/followerAlert.html',
        link: function($scope, elem, attrs) {

            var knownUsers = [];
            var initialized = false;
            var newFollowersQueue = [];
            var maxDisplayTime = 3000;
            var followerAlertStarted = 0;
            $scope.showAlert = false;

            $scope.user = null;

            $scope.$watch('followers', function() {
                if(!$scope.followers) {
                    return false;
                }
                update($scope.followers);
                initialized = true;
            });


            // just testing stuff
            //initialized = true;
            //window.update = update;

            function update(followers) {
                followers.forEach(function(follower) {
                    var user = follower.user;
                    if(!initialized) {
                        knownUsers.push(user._id);
                        return;
                    }
                    if(knownUsers.indexOf(user._id) !== -1) {
                        // we already know this user
                        return;
                    }

                    newFollowersQueue.push(user);
                });

            }

            Tick.register(function() {
                var now = new Date().getTime();
                if(!$scope.showAlert) {
                    if(newFollowersQueue.length === 0) {
                        return;
                    }
                    var user = newFollowersQueue.shift();
                    if(knownUsers.indexOf(user._id) !== -1) {
                        return;
                    }
                    followerAlertStarted = now;
                    $scope.user = user;
                    knownUsers.push(user._id);
                    $scope.showAlert = true;
                    return;
                }

                // theres still some time left to display the alert
                if(followerAlertStarted + maxDisplayTime > now) {
                    return;
                }

                // hide the follower alert
                $scope.showAlert = false;
            });

        }
    }
}]);