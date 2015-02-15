TwitchOverlay.service('Socket', ['$rootScope', 'Tick', function ($rootScope, Tick) {

    var socketConnected = false;
    var socket;
    var socketEvents = [];

    function SocketEvent(event, cb) {
        function checkForSocket(cb) {
            Tick.registerOnce(function() {
                if(!socketConnected) {
                    return checkForSocket(cb);
                }
                cb();
            });
        }

        checkForSocket(function() {
            socket.on(event, function() {
                cb.apply(this, arguments);
                apply();
            });
        });
    }

    function loadSocketIO(host, port) {
        var promise = jQuery.getScript('http://' + host + ':' + port + '/socket.io/socket.io.js');
        promise.done(function (script) {

            // evil :D
            (function () {
                eval(script);
            }).call(window);

            initializeSocket(host, port);
        });
        promise.fail(function () {
            console.log('Failed to load socket.io');
        });
    }

    function initializeSocket(host, port) {
        socket = io('http://' + host + ':' + port);
        socketConnected = true;
    }

    function apply() {
        if (!$rootScope.$$phase) {
            $rootScope.$apply();
        }
    }

    // if socketio is already in place we just connect
    if (typeof io !== 'undefined') {
        initializeSocket('127.0.0.1', 1337);
    }

    return {
        on: function(event, cb) {
            socketEvents.push(new SocketEvent(event, cb));
        },
        isConnected: function() {
            return socketConnected;
        },
        connect: function(host, port) {
            loadSocketIO(host, port);
        }
    }
}]);