var TwitchClient = require("../node-twitchtv")
  , account = require("../secrets/me.json");
  
var client = new TwitchClient(account);

client.games({ limit: 30}, function(err, games) {
  console.log(games.length);
});