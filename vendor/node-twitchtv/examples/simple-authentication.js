var TwitchClient = require("../node-twitchtv"),
    account = require("../secrets/me.json");

var client = new TwitchClient(account).auth({
  redirect_uri: "http://localhost"
});
