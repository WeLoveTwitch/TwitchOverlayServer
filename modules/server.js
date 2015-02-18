var TwitchChat = require('./twitch-chat');
var Twitch = require('./twitch');
var ActivityStream = require('./activity-stream');
var Database = require('./database');
var io = require('socket.io')();
var ip = require('ip');

function TwitchOverlayServer(config) {

    var that = this;

    this._bot = new TwitchChat();
    
    this._activityStream = new ActivityStream(new Database('activities'));
    this._twitch = new Twitch(new Database('twitch'), this._activityStream);
    
    var db = new Database('config').getHandle();
    this._db = null;

    this._data = {};

    this._sockets = [];

    io.on('connection', function (socket) {
        that._sockets.push(socket);
        that._tick();

        that._twitch.getEmotes(function (emotes) {
            socket.emit('emotes', emotes);
        });
    });

    this._socket = io.listen(config.port);

    (function loop() {
        setTimeout(loop, config.serverTick);
        that._tick.call(that);
    })();
}

var proto = TwitchOverlayServer.prototype;

proto._tick = function () {
    var that = this;
    this._twitch.get(function (data) {
        that._sockets.forEach(function (socket) {
            if (!that._socketConnected(socket)) {
                return false;
            }

            var updateData = {
                follower: data,
                chat: that._bot.getLastLines(),
                botStore: that._bot.getStore()
            };

            for (var key in that._data) {
                updateData[key] = that._data[key];
            }

            socket.emit('update', updateData);
        });
    });
};

proto._socketConnected = function (socket) {
    return socket.connected;
};

proto.destroy = function () {
    this._socket.close();
};

proto.setConfig = function (name, payload) {
    this._data[name] = payload;
    var that = this;
    this._db.find({_id: name}, function (err, docs) {
        console.log(arguments);
        if (docs.length > 0) {
            that._db.update({_id: name}, {_id: name, payload: payload});
        } else {
            that._db.insert({_id: name, payload: payload});
        }
    });
};

proto.getConfig = function (name) {
    return this._data[name] || null;
};

proto.getIp = ip.address;

proto.getModule = function (module) {
    return this['_' + module];
};

module.exports = TwitchOverlayServer;
