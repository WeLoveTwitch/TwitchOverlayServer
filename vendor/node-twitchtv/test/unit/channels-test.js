var TwitchClient = require("../../node-twitchtv")
  , should = require("should")
  , account = require("../conf/example.json");

describe("Channels", function() {
  
  var client = new TwitchClient(account);
  
  it("should return false if channel is missing in params", function() {
    client.channels({}, true).should.be.false;
  });
  it("should return false if callback isn't passed", function() {
    client.channels({ channel: "koolbeans" }).should.be.false;
  });
  it("should return false if callback is not a function", function() {
    client.channels({ channel: "koolcat" }, true).should.be.false;
  });
});
