var TwitchClient = require("../node-twitchtv")
  , account = require("../secrets/me.json");
  
var client = new TwitchClient(account);

client.users({ user: "nl_kripp"}, function(err, user) {
  console.log(user);
});