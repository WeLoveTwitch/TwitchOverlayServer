var FrontendComponent = require('../lib/frontend-component');
var inherits = require('util').inherits;

function FollowerAlert(twitch) {
    FrontendComponent.apply(this);

    this._name = 'followerAlert';
    this._twitch = twitch;
}

inherits(FollowerAlert, FrontendComponent);

var proto = FollowerAlert.prototype;

proto.bindEvents = function(socket) {
    var that = this;
    this._twitch.on('newFollower', function(user) {
        socket.emit(that._getEventName('update'), user);
    });

    // send some data initially here
};

module.exports = FollowerAlert;