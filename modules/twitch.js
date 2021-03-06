var TwitchClient = require('./twitch-api');
var account = require('../config/secrets').api;
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

function Twitch(db, activityStream) {

    EventEmitter.apply(this);

    var that = this;

    this._client = new TwitchClient(account);
    this._db = db.getCollection('twitch');
    this._emotes = null;
    this._activityStream = activityStream;

    that._getAllFollowersFromApi(function(followers) {
        that._saveFollowers(followers);
    });

    that._getEmoticonsFromApi(function(emotes) {
        that._emotes = emotes;
    });

}

inherits(Twitch, EventEmitter);

var proto = Twitch.prototype;

proto.tick = function () {
    this._getFollowerCount();
    this._getLatestFollowers();
};

proto._getEmoticonsFromApi = function(cb) {
    this._client.emoticons({channel: account.username }, function(err, emotes) {
        if(err) return;
        cb(emotes.emoticons);
    });
};

proto.getFollowerCount = function() {
    return this._totalFollows;
};

proto._getFollowerCount = function() {
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
    });
};

proto._saveFollowers = function (followers, fake) {
    fake = fake || false;
    var that = this;
    followers.forEach(function(follower, i) {
        var user = follower.user;
        that._db.find({_id: user._id}, function(err, knowFollowers) {
            var alreadyExists = knowFollowers.length > 0;
            if(!alreadyExists) {
                that._insertUser(user, fake);
            }

            if(i === followers.length - 1) {
                // @TODO; remove users that do no longer follow this channel
            }
        });
    });
};

proto._insertUser = function(user, fake) {
    var that = this;
    user.addedToDatabase = new Date().getTime();
    this._db.insert(user, function() {
        that.emit('newFollower', user);
        that._totalFollows++;
        that.emit('newFollowerCount', that._totalFollows);
    });
    this._activityStream.add('follower', user, fake);
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

        that._saveFollowers(follower.follows);
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

proto.cleanUpFollowers = function() {
    this._db.remove({ fake: true }, { multi: true }, function(error, count) {
        if(error) return false;
    });
    this._activityStream.cleanUpFollowers();
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
