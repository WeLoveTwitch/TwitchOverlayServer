var FrontendComponent = require('../lib/frontend-component');
var inherits = require('util').inherits;

function Followers(twitch, serverData) {
    FrontendComponent.apply(this);

    this._twitch = twitch;
    this._serverData = serverData;
}

inherits(Followers, FrontendComponent);

var proto = Followers.prototype;

proto.bindEvents = function(socket) {
    var that = this;

    this._twitch.on('newFollowerCount', function(count) {
        socket.emit('followers:countUpdate', count);
    });

    this.on('configUpdate:followerTarget', function(newTarget) {
        socket.emit('followers:newFollowerTarget', newTarget);
    });

    socket.on('followers:countUpdate', function() {
        socket.emit('followers:countUpdate', that._twitch.getFollowerCount());
    });

    socket.on('followers:newFollowerTarget', function() {
        console.log(that._serverData);
        socket.emit('followers:newFollowerTarget', that._serverData.followerTarget || 0);
    });
};

module.exports = Followers;