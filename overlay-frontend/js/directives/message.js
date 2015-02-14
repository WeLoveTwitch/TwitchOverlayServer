TwitchOverlay.directive('message', ['$rootScope', function($rootScope) {

    function strip(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    return {
        restrict: 'E',
        scope: {
            messageData: '='
        },
        link: function($scope, elem, attrs) {

            var message = strip($scope.messageData);
            $rootScope.emotes.forEach(function(emote) {
                var regex = new RegExp(emote.regex);
                message = message.replace(regex, '<img src="' + emote.url + '">');
            });

            elem.html('<span class="message">' + message + '</span>');
        }
    }
}]);