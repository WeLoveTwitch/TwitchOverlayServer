var TwitchClient = require("../../node-twitchtv"),
    should = require("should"),
    account = require("../conf/example.json");

describe("The awesome TwitchTV Users Resource", function() {

  var client = new TwitchClient(account);

  it("should return information in regards to a particular user", function(done) {
    client.users({
      user: "kungentv"
    }, function(err, ch) {

      ch.should.have.ownProperty("name");
      ch.should.have.ownProperty("created_at");
      ch.should.have.ownProperty("updated_at");
      ch.should.have.ownProperty("logo");
      ch.should.have.ownProperty("display_name");

      done();
    });
  });
});
