var TwitchClient = require("../vendor/node-twitchtv/node-twitchtv");
var account = require("../config/secrets.js").api;

function Twitch() {
    this._client = new TwitchClient(account);

    this._followerTarget = 50;

    this._followers = [];
    this._usernameMap = {};
    this._newFollowers = [];
    this._initialized = false;
    this._newestFollower = '';
    this._latestTotal = 0;

    this._getFollowers(100, 0, true, 'ASC');

}

var proto = Twitch.prototype;

proto.get = function (cb) {
    if (!this._initialized) return false;
    this._getFollowers(10, this._latestTotal - 5, false, 'ASC', (function (result) {
        var data = {
            followerTarget: this._followerTarget,
            followerCurrent: this._followers.length - 1,
            followerNewest: this._newestFollower,
            newFollowers: this._newFollowers.slice()
        };

        this._newFollowers = [];

        cb(data);
    }).bind(this));
};

proto._getFollowers = function (limit, offset, initial, direction, callback) {
    if (!this._initialized && !initial) return false;

    // default params
    direction = direction || 'DESC';
    callback = callback || function () {};
    initial = initial || false;

    var that = this;

    this._client.follows({
        channel: "xraymeta",
        limit: limit,
        offset: offset,
        direction: direction
    }, function (err, response) {
        that._latestTotal = response._total;
        response.follows.forEach(function (follower) {
            if (!that._usernameMap[follower.user.name]) {
                var newLen = that._followers.push(follower);
                that._usernameMap[follower.user.name] = newLen - 1;
                if (!initial) {
                    console.log('adding follower:', follower.user);
                    that._newestFollower = follower.user.name;
                    that._newFollowers.push(follower.user.name);
                }
            }
        });

        // recursion to load all users
        if (initial && offset + limit < response._total) {
            that._getFollowers(limit, offset + limit, initial)
        }

        if (initial && offset + limit >= response._total) {
            that._newestFollower = that._followers[that._followers.length - 1].user.name;
            that._initialized = true;
        }
        callback(response.follows);
    });
};

module.exports = Twitch;