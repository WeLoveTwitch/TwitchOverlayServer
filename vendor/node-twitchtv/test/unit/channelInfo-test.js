var TwitchClient = require("../../node-twitchtv")
  , should = require("should")
  , account = require("../conf/example.json");

describe("ChannelInfo", function() {
  
  var client = new TwitchClient(account);
  
  it("should return false if channel is missing in params", function() {
    client.channelinfo({}, true).should.be.false;
  });
  it("should return false if callback isn't passed", function() {
    client.channelinfo({ channel: "silentsentry" }).should.be.false;
  });
  it("should return false if callback is not a function", function() {
    client.channelinfo({ channel: "silentsentry" }, true).should.be.false;
  });
});