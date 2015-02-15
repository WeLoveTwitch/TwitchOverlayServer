TwitchOverlay.directive('chat', [function() {
    return {
        restrict: 'E',
        scope: {
            chatData: '='
        },
        replace: true,
        templateUrl: 'templates/directives/chat.html',
        link: function($scope, elem, attrs) {

            var _maxHeight = 331;

            $scope.showChatFrame = function() {
                if(!$scope.chatData) return false;
                var visibleLines = $scope.chatData.filter(function(line) {
                    return $scope.showLine(line.ts);
                });
                return visibleLines.length > 0;
            };

            $scope.showLine = function(ts) {
                // only show lines if they are not older than 10 minutes
                return ts > +new Date().getTime() - 1000 * 60 * 10;
            };

            window.setInterval(function() {
                var markup = elem.find('.line-container');

                if (markup.height() < _maxHeight) {
                    elem.height(markup.height() + 6);
                } else {
                    elem.height(_maxHeight);
                }
            }, 100);
        }
    }
}]);
