TwitchOverlay.directive('chat', [function() {
    return {
        restrict: 'E',
        scope: {
            chatData: '='
        },
        templateUrl: 'templates/directives/chat.html',
        link: function($scope, elem, attrs) {
            $scope.showChatFrame = function() {
                var visibleLines = $scope.chatData.filter(function(line) {
                    return $scope.showLine(line.ts);
                });
                return visibleLines.length > 0;
            };
            $scope.showLine = function(ts) {
                // only show lines if they are not older than 10 minutes
                return ts > +new Date().getTime() - 1000 * 60 * 10;
            }
        }
    }
}]);