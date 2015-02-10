var TwitchClient = require("../node-twitchtv")
  , account = require("../secrets/me.json");
  
var client = new TwitchClient(account);

client.channels({ channel: "xraymeta"}, function(err, follows) {
  console.log(follows)
});