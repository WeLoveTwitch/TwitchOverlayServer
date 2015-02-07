module.exports = function twitch() {

    var TwitchClient = require("node-twitchtv");
    var account = require("../config/secrets.js");
    var client = new TwitchClient(account);

    var followerTarget = 50;

    var followers = [];
    var usernameMap = {};
    var newFollowers = [];
    var initialized = false;
    var newestFollower = '';
    var latestTotal = 0;

    function getFollowers(limit, offset, initial, direction, callback) {
        if(!initialized && !initial) return false;
        direction = direction || 'DESC';
        callback = callback || function() {};
        initial = initial || false;
        client.follows({ channel: "xraymeta", limit: limit, offset: offset, direction: direction }, function(err, response) {
            latestTotal = response._total;
            response.follows.forEach(function(follower) {
                if(!initial) {
                    //console.log(follower.user.name);
                }
                if(!usernameMap[follower.user.name]) {
                    var newLen = followers.push(follower);
                    usernameMap[follower.user.name] = newLen - 1;
                    if(!initial) {
                        console.log('adding follower:', follower.user);
                        newestFollower = follower.user.name;
                        newFollowers.push(follower.user.name);
                    }
                }
            });

            // recursion to load all users
            if(initial && offset + limit < response._total) {
                getFollowers(limit, offset + limit, initial)
                //console.log('recursive init calls', offset, limit, response._total);
            }

            if(initial && offset + limit >= response._total) {
                newestFollower = followers[followers.length - 1].user.name;
                initialized = true;
            }
            callback(response.follows);
        });
    }

    getFollowers(100, 0, true, 'ASC');

    return Object.freeze({
        get: function(cb) {
            if(!initialized) return false;
            getFollowers(10, latestTotal - 5, false, 'ASC', function(result) {
                var data = {
                    followerTarget: followerTarget,
                    followerCurrent: followers.length - 1,
                    followerNewest: newestFollower,
                    newFollowers: newFollowers.slice(),
                    //newFollowers: ['schnitzel']
                };

                newFollowers = [];
                //console.log('Added followers:', newFollowers);

                cb(data);
            });
        }
    });
};