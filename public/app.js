(function () {

  function Chat(elementId) {
    this._elem = $('#' + elementId);
    this._maxHeight = 331;
  }

  Chat.prototype.update = function(lines) {
    this._clear();
    var markup = this._createMarkup(lines);
    this._elem.html(markup);

    if(markup.height() < this._maxHeight) {
      this._elem.height(markup.height() + 10);
    } else {
      this._elem.height(this._maxHeight);
    }
  };

  Chat.prototype._clear = function() {
    this._elem.empty();
  };

  Chat.prototype._createMarkup = function(lines) {
    var that = this;

    var $lineContainer = $('<div />');
    $lineContainer.addClass('line-container');

    lines.forEach(function(line) {

      // time
      var $time = $('<span />');
      $time.addClass('time');
      $time.text(that._getTimeFromTimestamp(line.ts));

      // nick
      var $nick = $('<span />');
      $nick.addClass('nick');
      $nick.text(line.nick);

      // message
      var $message = $('<span />');
      $message.addClass('message');
      $message.text(line.message);

      var $line = $('<div />');
      $line.addClass('line');

      $line.append($time);
      $line.append($nick);
      $line.append($message);

      $lineContainer.append($line);

    });

    return $lineContainer;
  };

  Chat.prototype._getTimeFromTimestamp = function(ts) {
    var date = new Date(ts);
    return date.getHours() + ':' + ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes());
  };

  $().ready(function () {
    var socket = io();
    var newFollowers = [];
    var newFollowerShownSince = 0;
    var showNewFollowersFor = 4000;
    var chat = new Chat('chat');

    socket.on('reconnect', function () {
      document.location.reload(true);
    });

    socket.on('update', function (data) {
      updateUI(data.follower);
      chat.update(data.chat);
    });

    var currentFollowers = $('.current-followers');
    var targetFollowers = $('.target-followers');
    var newestFollower = $('.newest-follower');
    var newFollowerContainer = $('.new-follower');

    function updateUI(data) {
      data.newFollowers.forEach(function (follower) {
        newFollowers.push(follower);
      });
      currentFollowers.text(data.followerCurrent);
      targetFollowers.text(data.followerTarget);
      newestFollower.text(data.followerNewest);
    }

    setInterval(checkNewFollower, 100);

    function checkNewFollower() {
      var now = new Date().getTime();
      if (newFollowerShownSince !== 0 && newFollowerShownSince + showNewFollowersFor < now) {
        newFollowerShownSince = 0;
        newFollowerContainer.css({top: -100});
        setTimeout(checkNewFollower, 400);
        return;
      }
      if (newFollowers.length === 0 || newFollowerShownSince !== 0) return false;
      var newFollower = newFollowers.shift();
      newFollowerContainer.find('.new-follower-name').text(newFollower);
      newFollowerContainer.css({top: 100});
      newFollowerShownSince = now;
    }
  });
})();