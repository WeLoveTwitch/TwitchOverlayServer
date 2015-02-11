TwitchOverlay.service('TwitchOverlayServer', ['$rootScope', function($rootScope) {
    var TwitchOverlayServer = require('./modules/server');
    var config = require('./config/default.js');

    var server = null;

    return {
        start: function() {
            if(server) return false;
            server = new TwitchOverlayServer(config);
        },
        stop: function() {
            if(!server) return false;
            server.destroy();
            server = null;
        },
        isRunning: function() {
            return !!server;
        }
    };
}]);