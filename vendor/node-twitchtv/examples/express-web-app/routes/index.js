var TwitchClient = require("node-twitchtv");

var client = new TwitchClient();

/*
 * GET home page.
 */

exports.index = function(req, res){
  // bam! it's that easy to integrate!
  client.games({ limit: 20 }, function(err, games) {
    res.render('index', { title: 'Twitch Express Games List', games: games });
  });
  
};