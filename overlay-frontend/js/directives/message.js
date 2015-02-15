TwitchOverlay.directive('message', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            messageData: '='
        },
        link: function($scope, elem, attrs) {

            var emotes = $rootScope.emotes.sort(function(a, b) {
                // a.regex.length - b.regex.length
                if(a.regex.length > b.regex.length) {
                    return -1;
                }
                if(a.regex.length < b.regex.length) {
                    return 1;
                }
                return 0;
            });

            var message = sanitize($scope.messageData, {
                allowedTags: []
            });
            emotes.forEach(function(emote) {
                var regex = new RegExp(emote.regex);
                message = message.replace(regex, '<img src="' + emote.url + '">');
            });

            elem.html('<span class="message">' + message + '</span>');
        }
    }
}]);