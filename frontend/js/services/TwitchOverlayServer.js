TwitchOverlay.service('TwitchOverlayServer', ['$rootScope', function($rootScope) {
    var TwitchOverlayServer = require('./modules/server');
    var config = require('./config/default.js');

    var server = null;

    // add an event listener and call apply after event was triggered
    function on(moduleName, event, cb) {
        var module = server.getModule(moduleName);
        if(!module) {
            throw new Error('trying to an event listener to the unknown module: ' + module);
        }
        module.on(event, function() {
            cb.apply(this, arguments);
            if(!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
    }

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
            server.getModule('twitch').getFollowers(function(err, data) {
                if(err) return;
                cb(data);
            });
        },
        getServer: function() {
            return server;
        },
        on: function(module, event, cb) {
            return on(module, event, cb);
        }
    };
}]);
