var secrets = require('../config/secrets');
var irc = require('twitch-irc');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

// docs can be found here: https://github.com/Schmoopiie/twitch-irc/wiki

function TwitchChat(activityStream) {

    EventEmitter.apply(this);

    this._activityStream = activityStream;
    this._client = new irc.client({
        options: {
            debug: true,
            debugIgnore: [],
            logging: false,
            tc: 3
        },
        identity: {
            username: secrets.bot.nick,
            password: secrets.bot.password
        },
        channels: [secrets.bot.channel]
    });

    this._client.connect();

    this._bindEvents();
}

inherits(TwitchChat, EventEmitter);

var proto = TwitchChat.prototype;

proto._bindEvents = function() {
    var that = this;
    // retrieved a message in a channel
    this._client.addListener('chat', function(channel, user, message) {
        that.emit('message', {
            channel: channel,
            user: user,
            message: message,
            ts: new Date().getTime()
        });
    });
    // Someone has subscribed to a channel
    this._client.addListener('subscription', function(channel, username) {
        that.emit('subscription', channel, username);
        that._activityStream.add('subscriber', user);
    });
    // User has joined a channel
    this._client.addListener('join', function(channel, username) {
        that.emit('join', channel, username);
    });

    // User has left a channel
    this._client.addListener('part', function(channel, username) {
        that.emit('part', channel, username);
    });

    // Channel is now hosted by another broadcaster
    this._client.addListener('hosted', function(channel, username, viewers) {
        that.emit('hosted', channel, username, viewers);
        that._activityStream.add('hosted', {
            user: username,
            viewers: viewers
        });
    });

    // Channel is now hosting another broadcaster.
    this._client.addListener('hosting', function(channel, target, remains) {
        // `remains` is the number of host commands left for this hour
        that.emit('hosting', channel, target, remains);
        that._activityStream.add('hosting', {
            user: target,
            remains: remains
        });
    });

    // Channel ended the current hosting..
    this._client.addListener('unhost', function(channel, remains) {
        // `remains` is the number of host commands left for this hour
        that.emit('unhost', channel, remains);
        that._activityStream.add('unhost', {
            remains: remains
        });
    });
};

module.exports = TwitchChat;
