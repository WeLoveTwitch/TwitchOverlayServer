TwitchOverlay.service('TwitchOverlayServer', ['$rootScope', function($rootScope) {
    var TwitchOverlayServer = require('./modules/server');
    var config = require('./config/default.js');

    var server = null;

    $rootScope.config = config;

    return {
        start: function() {
            if(server) return false;
            server = new TwitchOverlayServer(config);
            $rootScope.ip = server.getIp();
        },
        stop: function() {
            if(!server) return false;
            server.destroy();
            server = null;
        },
        isRunning: function() {
            return !!server;
        },
        setConfig: function(name, payload) {
            return server.setConfig(name, payload);
        },
        getConfig: function(name) {
            return server.getConfig(name);
        },
        getFollowers: function(cb) {
            try {
                server.getModule('twitch').getFollowers(cb);
            } catch (error) {
                console.log(error.message);
            }
        }
    };
}]);
