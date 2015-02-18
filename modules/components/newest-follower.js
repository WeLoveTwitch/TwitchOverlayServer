var FrontendComponent = require('../lib/frontend-component');
var inherits = require('util').inherits;

function NewestFollower(twitch) {
    FrontendComponent.apply(this);

    this._twitch = twitch;
}

inherits(NewestFollower, FrontendComponent);

var proto = NewestFollower.prototype;

proto.bindEvents = function(socket) {
    var that = this;

    this._twitch.on('newFollower', function(newestFollower) {
        socket.emit('newestFollower:update', newestFollower);
    });

    socket.on('newestFollower:update', function() {
        that._twitch._getLatestFollower(function(err, newestFollower) {
            socket.emit('newestFollower:update', newestFollower);
        });
    });
};

module.exports = NewestFollower;