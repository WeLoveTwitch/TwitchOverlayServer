var FrontendComponent = require('../lib/frontend-component');
var inherits = require('util').inherits;

function Followers(twitch, serverData) {
    FrontendComponent.apply(this);

    this._name = 'followers';
    this._twitch = twitch;
    this._serverData = serverData;
}

inherits(Followers, FrontendComponent);

var proto = Followers.prototype;

proto.bindEvents = function(socket) {
    var that = this;

    this.bindGenericEvents(socket);

    this._twitch.on('newFollowerCount', function(count) {
        socket.emit(that._getEventName('countUpdate'), count);
    });

    this.on('configUpdate:followerTarget', function(newTarget) {
        socket.emit(this._getEventName('newFollowerTarget'), newTarget);
    });

    socket.on(this._getEventName('countUpdate'), function() {
        socket.emit(that._getEventName('countUpdate'), that._twitch.getFollowerCount());
    });

    socket.on(this._getEventName('newFollowerTarget'), function() {
        socket.emit(that._getEventName('newFollowerTarget'), that._serverData.followerTarget || 0);
    });
};

module.exports = Followers;
