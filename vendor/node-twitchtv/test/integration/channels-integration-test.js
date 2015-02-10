var TwitchClient = require("../../node-twitchtv"),
    should = require("should"),
    account = require("../conf/example.json");

describe("The awesome TwitchTV Channels Resource", function() {

  var client = new TwitchClient(account);

  it("should return information based on a channel", function(done) {
    client.channels({
      channel: "kungentv"
    }, function(err, ch) {

      ch.should.have.ownProperty("name");
      ch.should.have.ownProperty("game");
      ch.should.have.ownProperty("banner");
      ch.should.have.ownProperty("logo");
      ch.should.have.ownProperty("url");

      done();
    });
  });

});
