var request = require("request"),
    _ = require("underscore")
    logger = require("winston");

var twitch_url = "https://api.twitch.tv/kraken";
var twitch_api_url = "http://api.twitch.tv/api";

TwitchClient = function(config) {
  try {
    this.client_id = config.client_id;
    this.username = config.username;
    this.password = config.password;
    this.scope = config.scope;

  } catch (err) {
    logger.warn("Please remember to set your client_id!");
  }

  return this;
};

TwitchClient.prototype.auth = function authenticate(config) {

  logger.warn("Authorization is still being implemented.");

  var params = _.extend({}, {
    client_id: this.client_id,
    username: this.username,
    password: this.password,
    scope: this.scope,
    response_type: "token"
  }, config);

  request.post({
    url: twitch_url + "/oauth2/authorize",
    form: params
  }, function(err, response, body) {

  });
};

TwitchClient.prototype.games = function retrieveGames(params, callback) {
  if (!callback || typeof callback != 'function') return false;

  var self = this;

  request.get({
    url: twitch_url + "/games/top",
    qs: params
  }, function(err, response, body) {
    body = JSON.parse(body);
    var games = body.top;
    if (callback) callback.call(self, null, games, body);
  });
};

TwitchClient.prototype.channels = function retrieveChannels(params, callback) {
  if (typeof params.channel == 'undefined' || !params.channel) return false;

  return retrieveResource(twitch_url + "/channels/" + params.channel, callback);
};

TwitchClient.prototype.streams = function retrieveChannels(params, callback) {
  if (typeof params.channel == 'undefined' || !params.channel) return false;

  return retrieveResource(twitch_url + "/streams/" + params.channel, callback);
};

TwitchClient.prototype.videos = function retrieveChannels(params, callback) {
  if (typeof params.channel == 'undefined' || !params.channel) return false;

  return retrieveResource(twitch_url + "/channels/" + params.channel + "/videos", callback);
};

TwitchClient.prototype.users = function retrieveUserInformation(params, callback) {
  if (typeof params.user == 'undefined' || !params.user) return false;

  return retrieveResource(twitch_url + "/users/" + params.user, callback);
};

TwitchClient.prototype.channelinfo = function retrieveChannelInformation(params, callback) {
  if (typeof params.channel == 'undefined' || !params.channel) return false;

  return retrieveResource(twitch_api_url + "/channels/" + params.channel + "/panels", callback);
};

TwitchClient.prototype.follows = function retrieveFollowerInformations(params, callback) {
    if (typeof params.channel == 'undefined' || !params.channel) return false;

    return retrieveResource(twitch_url + "/channels/" + params.channel + "/follows", callback);
};

function retrieveResource(url, callback) {
    if (url == 'undefined' || !url) return false;
    if (!callback || typeof callback != 'function') return false;

    var self = this;

    request.get({
        url: url
    }, function(err, response, body) {
        body = JSON.parse(body);
        if (callback) callback.call(self, null, body);
    });
}

module.exports = TwitchClient;
