var request = require('request');
var _ = require('lodash');

var twitch_url = 'https://api.twitch.tv/kraken';
var twitch_api_url = 'http://api.twitch.tv/api';

function TwitchClient(config) {
    try {
        this.client_id = config.client_id;
        this.username = config.username;
        this.password = config.password;
        this.scope = config.scope;

    } catch (err) {
        console.log('Please remember to set your client_id!');
    }

    return this;
}

var proto = TwitchClient.prototype;

proto.auth = function authenticate(config) {

    console.log('Authorization is still being implemented.');

    var params = _.extend({}, {
        client_id: this.client_id,
        username: this.username,
        password: this.password,
        scope: this.scope,
        response_type: 'token'
    }, config);

    request.post({
        url: twitch_url + '/oauth2/authorize',
        form: params
    }, function (err, response, body) {

    });
};

proto.games = function retrieveGames(params, callback) {
    if (!callback || typeof callback != 'function') return false;

    this._retrieveResource(twitch_url + '/games/top', callback, params);
};

proto.channels = function retrieveChannels(params, callback) {
    if (typeof params.channel == 'undefined' || !params.channel) return false;

    return this._retrieveResource(twitch_url + '/channels/' + params.channel, callback);
};

proto.streams = function retrieveChannels(params, callback) {
    if (typeof params.channel == 'undefined' || !params.channel) return false;

    return this._retrieveResource(twitch_url + '/streams/' + params.channel, callback);
};

proto.videos = function retrieveChannels(params, callback) {
    if (typeof params.channel == 'undefined' || !params.channel) return false;

    return this._retrieveResource(twitch_url + '/channels/' + params.channel + '/videos', callback);
};

proto.users = function retrieveUserInformation(params, callback) {
    if (typeof params.user == 'undefined' || !params.user) return false;

    return this._retrieveResource(twitch_url + '/users/' + params.user, callback);
};

proto.emoticons = function retrieveEmoticons(params, callback) {
    var url = twitch_url + '/chat/' + params.channel + '/emoticons';
    console.log(url);
    return this._retrieveResource(url, callback);
};

proto.channelinfo = function retrieveChannelInformation(params, callback) {
    if (typeof params.channel == 'undefined' || !params.channel) return false;

    return this._retrieveResource(twitch_api_url + '/channels/' + params.channel + '/panels', callback);
};

proto.follows = function retrieveFollowerInformations(params, callback) {
    if (typeof params.channel == 'undefined' || !params.channel) return false;

    var limit = params.limit || 25;
    var offset = params.offset || 0;
    var direction = params.direction || 'DESC';

    return this._retrieveResource(twitch_url + '/channels/' + params.channel + '/follows', callback, {
        limit: limit,
        offset: offset,
        direction: direction
    });
};

proto._parse = function (jsonString, callback) {
    var result = null;
    var error = null;
    try {
        result = JSON.parse(jsonString)
    } catch (e) {
        error = e;
    }
    callback(error, result);
};

proto._retrieveResource = function (url, callback, params) {
    if (!url || typeof callback !== 'function') return false;

    var ready = (function (err, response, body) {
        this._parse(body, callback);
    }).bind(this);

    request.get({url: url, qs: params || {}}, ready);
};

module.exports = TwitchClient;
