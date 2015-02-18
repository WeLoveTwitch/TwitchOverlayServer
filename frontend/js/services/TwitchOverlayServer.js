TwitchOverlay.service('TwitchOverlayServer', ['$rootScope', function ($rootScope) {

    var TwitchOverlayServer = require('./modules/server');
    var config = require('./config/default.js');
    var server = null;

    // Add an event listener and call apply after event was triggered
    function on(moduleName, event, callback) {
        var module = server.getModule(moduleName);

        if ( ! module) {
            throw new Error('Undefined module: ' + module);
        }

        module.on(event, function () {
            callback.apply(this, arguments);

            if ( ! $rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
    }

    $rootScope.config = config;

    return {
        start: function () {
            if (server) return false;
            server = new TwitchOverlayServer(config);
            $rootScope.ip = server.getIp();
        },
        stop: function () {
            if ( ! server) return false;
            server.destroy();
            server = null;
        },
        isRunning: function () {
            return !!server;
        },
        setConfig: function (name, payload) {
            return server.setConfig(name, payload);
        },
        getConfig: function (name) {
            return server.getConfig(name);
        },
        getActivities: function (callback) {
            server.getModule('twitch').getActivities(function (error, data) {
                if (error) return;
                callback(data);
            });
        },
        getFollowers: function (callback) {
            server.getModule('twitch').getFollowers(function (error, data) {
                if (error) return;
                callback(data);
            });
        },
        getServer: function () {
            return server;
        },
        on: function (module, event, callback) {
            return on(module, event, callback);
        }
    };

}]);
