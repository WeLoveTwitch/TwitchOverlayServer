TwitchOverlay.directive('message', ['Emote', function(Emote) {
    return {
        restrict: 'E',
        scope: {
            messageData: '='
        },
        link: function($scope, elem, attrs) {
            var message = sanitize($scope.messageData, {
                allowedTags: []
            });

            Emote.get().forEach(function(emote) {
                var regex = new RegExp(emote.regex);
                message = message.replace(regex, '<img src="' + emote.url + '">');
            });

            elem.html('<span class="message">' + message + '</span>');
        }
    }
}]);