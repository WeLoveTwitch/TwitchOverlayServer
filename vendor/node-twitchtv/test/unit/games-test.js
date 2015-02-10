var TwitchClient = require("../../node-twitchtv")
  , should = require("should")
  , account = require("../conf/example.json");

describe("Games", function() {
  
  var client = new TwitchClient(account);

  it("should return false if callback isn't passed", function() {
    client.games({}).should.be.false;
  });
  it("should return false if callback is not a function", function() {
    client.games({}, true).should.be.false;
  });
});
