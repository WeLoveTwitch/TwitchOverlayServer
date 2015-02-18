var TwitchClient = require('./twitch-api');
var account = require('../config/secrets').api;
var queue = require('queue-async');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

function Twitch(db, activityStream) {

    EventEmitter.apply(this);

    var that = this;

    this._client = new TwitchClient(account);
    this._db = null;
    this._emotes = null;
    this._activityStream = activityStream;

    db.getCollection('twitch', function (instance) {
        that._db = instance;
    });

    that._getAllFollowersFromApi(function(followers) {
        that._saveFollowers(followers);
    });

    that._getEmoticonsFromApi(function(emotes) {
        that._emotes = emotes;
    });

}

inherits(Twitch, EventEmitter);

var proto = Twitch.prototype;

proto.get = function (cb) {
    var q = queue();
    q.defer(this._getFollowerCount.bind(this));
    q.defer(this._getLatestFollower.bind(this));
    q.defer(this._getLatestFollowers.bind(this));

    q.awaitAll((function(err, data) {
        cb({
            followerCurrent: data[0],
            followerNewest: data[1],
            latestFollowers: data[2]
        });
    }).bind(this));
};

proto._getEmoticonsFromApi = function(cb) {
    this._client.emoticons({channel: account.username }, function(err, emotes) {
        if(err) return;
        cb(emotes.emoticons);
    });
};

proto._getFollowerCount = function(cb) {
    var that = this;
    this._client.follows({
        channel: account.username,
        offset: 0,
        limit: 1,
        direction: 'ASC'
    }, function(err, follower) {
        if(err) {
            return;
        }
        that._totalFollows = follower._total;
        cb(null, follower._total)
    });
};

proto._saveFollowers = function (followers, callback) {
    callback = callback || function() {};
    var that = this;
    followers.forEach(function(follower, i) {
        var user = follower.user;
        that._db.find({_id: user._id}, function(err, knowFollowers) {
            var alreadyExists = knowFollowers.length > 0;
            if(!alreadyExists) {
                that._insertUser(user);
            }

            // @TODO; remove users that do no longer follow this channel
            if(i === followers.length - 1) {
                callback();
            }
        });
    });
};

proto._insertUser = function(user) {
    var that = this;
    user.addedToDatabase = new Date().getTime();
    this._db.insert(user, function() {
        that.emit('newFollower', user);
    });
    this._activityStream.add('follower', user);
};

proto._getLatestFollower = function(cb) {
    this._db.findOne({}).sort({ addedToDatabase: -1}).exec(function(err, follower) {
        cb(err, follower)
    });
};

proto._getLatestFollowers = function(cb) {
    var limit = 10;
    var that = this;
    this._client.follows({
        channel: account.username,
        offset: this._totalFollows - limit,
        limit: limit,
        direction: 'ASC'
    }, function(err, follower) {
        if(err) return false;

        that._saveFollowers(follower.follows, function() {
            cb(null, follower.follows);
        });
    });
};

proto._getAllFollowersFromApi = function(callback) {
    var followers = [];
    var that = this;
    (function getRecursive(offset, limit, callback) {
        that._client.follows({
            channel: account.username,
            offset: offset,
            limit: limit,
            direction: 'ASC'
        }, function(err, follower) {

            if(err) {
                return false;
            }

            // follower._total: total amount of followers
            // follower.follows: list of followers

            followers = followers.concat(follower.follows);
            if(follower.follows.length === limit) {
                return getRecursive(offset + limit, limit, callback);
            }
            callback();
        });
    })(0, 25, function() {
        callback(followers);
    });
};

proto.getFollowers = function(cb) {
    this._db.find({}).sort({ addedToDatabase: -1}).exec(function(err, followers) {
        if(err) return false;
        cb(null, followers)
    });
};

proto.getActivities = function(cb) {
    this._activityStream.get(cb);
};

proto.getEmotes = function(cb) {
    if(!this._emotes) {
        return this._getEmoticonsFromApi(cb);
    }
    cb(this._emotes);
};

module.exports = Twitch;
