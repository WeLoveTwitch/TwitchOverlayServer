var TwitchChat = require('./twitch-chat');
var Twitch = require('./twitch');
var ActivityStream = require('./activity-stream');
var Database = require('./database');
var io = require('socket.io')();
var ip = require('ip');
var ComponentFactory = require('./lib/frontend-component-factory');

function TwitchOverlayServer(config) {

    var that = this;

    this._data = {};
    this._db = new Database();
    this._activityStream = new ActivityStream(this._db);

    this._chat = new TwitchChat(this._activityStream);
    this._twitch = new Twitch(this._db, this._activityStream);

    this._componentFactory = new ComponentFactory(
        this._db.getCollection('components'),
        {
            twitch: this._twitch,
            chat: this._chat,
            serverData: this._data
        }
    );

    this._sockets = [];

    this._configCollection = null;
    this._configCollection = this._db.getCollection('config');

    this._configCollection.find({}, function(err, docs) {
        docs.forEach(function(doc) {
            that._data[doc._id] = doc.payload;
        });
    });

    io.on('connection', function (socket) {
        that._sockets.push(socket);

        console.log('client connected');

        that._componentFactory.registerClient(socket);

        that._twitch.getEmotes(function (emotes) {
            socket.emit('emotes', emotes);
        });

        socket.on('disconnect', function() {
            that._sockets = that._sockets.filter(function(s) {
                that._componentFactory.unregisterClient(socket);
                return s.id === socket;
            });
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
    this._twitch.tick();
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

    this._components.forEach(function(component) {
        component.emit('configUpdate:' + name, payload);
    });

    this._configCollection.find({_id: name}, function (err, docs) {
        if (docs.length > 0) {
            that._configCollection.update({_id: name}, {_id: name, payload: payload});
        } else {
            that._configCollection.insert({_id: name, payload: payload});
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

proto.getComponentFactory = function () {
    return this._componentFactory;
};

module.exports = TwitchOverlayServer;
