var TwitchChat = require('./twitch-chat');
var Twitch = require('./twitch');
var Database = require('./database');
var io = require('socket.io')();

function TwitchOverlayServer(config) {

    var that = this;

    this._bot = new TwitchChat();
    this._twitch = new Twitch(new Database('twitch'));

    this._sockets = [];

    io.on('connection', function (socket) {
        that._sockets.push(socket);
    });

    this._socket = io.listen(config.port);

    (function loop() {
        setTimeout(loop, config.serverTick);
        that._tick.call(that);
    })();
}

var proto = TwitchOverlayServer.prototype;

proto._tick = function() {
    var that = this;
    this._twitch.get(function (data) {
        that._sockets.forEach(function (socket) {
            if (!that._socketConnected(socket)) {
                return false;
            }
            socket.emit('update', {
                follower: data,
                chat: that._bot.getLastLines(),
                botStore: that._bot.getStore()
            });
        });
    });
};

proto._socketConnected = function (socket) {
    return socket.connected;
};

proto.destroy = function() {
    this._socket.engine.close()
};

module.exports = TwitchOverlayServer;