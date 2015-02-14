var TwitchClient = require('./twitch-api');
var account = require('../config/secrets').api;
var queue = require('queue-async');

function Twitch(db) {
    this._client = new TwitchClient(account);
    this._db = null;

    var that = this;

    db.ready(function(_db) {
        that._db = _db;
    });

}

var proto = Twitch.prototype;

proto.get = function (cb) {

    if(!this._db) {
        return cb(null, {});
    }

    this._saveFollowers();

    var q = queue();
    q.defer(this._getFollowerCount.bind(this));
    q.defer(this._getLatestFollower.bind(this));

    q.awaitAll((function(err, data) {
        cb({
            followerCurrent: data[0],
            followerNewest: data[1]
        });
    }).bind(this));
};

proto._getFollowerCount = function(cb) {
    this._db.count({}, (function (err, count) {
        cb.call(this, err, count)
    }).bind(this));
};

proto._saveFollowers = function () {

    var that = this;

    this._client.follows({
        channel: account.username,
        limit: 100,
        offset: 0,
        direction: 'DESC'
    }, function (err, response) {
        if(!response) {
            return false;
        }
        response.follows.forEach(function (follower) {
            var user = follower.user;
            that._db.find({_id: user._id}, function(err, knowFollowers) {
                var alreadyExists = knowFollowers.length > 0;
                if(!alreadyExists) {
                    user.addedToDatabase = new Date().getTime();
                    that._db.insert(user);
                }
            });
        });
    });
};

proto._getLatestFollower = function(cb) {
    this._db.findOne({}).sort({ addedToDatabase: -1}).exec(function(err, follower) {
        cb(err, follower)
    });
};

module.exports = Twitch;