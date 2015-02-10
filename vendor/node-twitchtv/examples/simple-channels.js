var TwitchClient = require("../node-twitchtv")
  , account = require("../secrets/me.json");
  
var client = new TwitchClient(account);

client.channels({ channel: "nl_kripp"}, function(err, channel) {
    //best hunter US!
  console.log(channel.name);
  console.log(channel.game);  
  console.log(channel.status);
  
});