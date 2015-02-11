TwitchOverlay.directive('chat', [function() {
    return {
        restrict: 'E',
        scope: {
            chatData: '='
        },
        templateUrl: 'templates/directives/chat.html',
        link: function($scope, elem, attrs) {
            $scope.$watch('chatData', function() {
               console.log($scope);
            });
        }
    }
}]);