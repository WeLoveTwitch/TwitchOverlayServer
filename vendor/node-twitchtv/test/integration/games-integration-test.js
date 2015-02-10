var TwitchClient = require("../../node-twitchtv"),
    should = require("should"),
    account = require("../conf/example.json");

describe("The awesome TwitchTV Games Resource", function() {

  var client = new TwitchClient(account);

  it("should return a list of games", function(done) {
    client.games({}, function(err, games) {
      games.length.should.equal(10);
      games[0].should.have.ownProperty("game");
      games[0].should.have.ownProperty("viewers");
      games[0].should.have.ownProperty("channels");
      done();
    });
  });

});
