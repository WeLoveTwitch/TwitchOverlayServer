var TwitchClient = require("../../node-twitchtv")
  , should = require("should")
  , account = require("../conf/example.json");

describe("Videos", function() {
  
  var client = new TwitchClient(account);
  
  it("should return false if channel is missing in params", function() {
    client.videos({}, true).should.be.false;
  });
  it("should return false if callback isn't passed", function() {
    client.videos({ channel: "koolbeans" }).should.be.false;
  });
  it("should return false if callback is not a function", function() {
    client.videos({ channel: "koolcat" }, true).should.be.false;
  });
});
