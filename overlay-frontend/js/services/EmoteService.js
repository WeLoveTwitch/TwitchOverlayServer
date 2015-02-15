TwitchOverlay.service('Emote', ['Socket', function(Socket) {

    var emotes = [];

    Socket.on('emotes', function(emotesFromServer) {
        emotes.length = 0;

        emotesFromServer = emotesFromServer.sort(function(a, b) {
            if(a.regex.length > b.regex.length) {
                return -1;
            }
            if(a.regex.length < b.regex.length) {
                return 1;
            }
            return 0;
        });

        emotesFromServer.forEach(function(emote) {
            emotes.push(emote);
        });
    });

    return {
        get: function() {
            return emotes;
        }
    }
}]);