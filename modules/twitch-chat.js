var Client = require('irc').Client;

function ChatLine(data) {
  this.ts = new Date().getTime();
  this.user = data.user;
  this.nick = data.nick;
  this.message = data.message || data.args[1];

  console.log(this);
}


function TwitchChat() {

  this._channel = '#xraymeta';

  this._client = new Client('irc.twitch.tv', 'XRAYMETABot', {
    channels: [this._channel],
    autoRejoin: true,
    sasl: true,
    password: 'oauth:zx5mkkszdf3wn6yketx71s3p6lztrv',
    nick: 'XRAYMETABot',
    userName: 'XRAYMETABot',
    autoConnect: true
  });

  this._lines = [];

  var that = this;

  this._client.connect();

  this._client.addListener('message', function (from, to, message, data) {
    if(that._isCommand(message)) {
      that._parseCommand(from, message);
    }
    that._addLine(data);
  });

  this._client.addListener('error', function (err) {
    console.log('error:', err);
  });

  /*this._client.addListener('registered', function () {
    console.log('registered:', arguments);
  });

  this._client.addListener('connect', function () {
    console.log('connect:', arguments);
  });

  this._client.addListener('data', function () {
    console.log('data:', arguments);
  });*/

  this._client.addListener('close', function () {
    console.log('close:', arguments);
  });

  // Greet once
  this._client.once('join', function () {

  });
}

var proto = TwitchChat.prototype;

proto._addLine = function(data) {
  var newLine = new ChatLine(data);
  if(this._checkForDuplicate(newLine) === false) {
    this._lines.push(newLine);
  }
};

proto.say = function(text) {
  this._client.say(this._channel, text);
  this._addLine({
    message: text,
    user: 'bot',
    nick: 'bot'
  });
};

proto._checkForDuplicate = function(obj) {
  for(var i = 0; i < this._lines.length; i++) {
    var line = this._lines[i];
    if (Math.floor(line.ts / 1000) === Math.floor(obj.ts / 1000) && line.user === obj.user && line.message === line.message) {
      return true;
    }
  }
  return false;
};

proto._isCommand = function(message) {
  return message.indexOf('!') === 0;
};

proto._parseCommand = function(from, message) {
  var args = message.slice(1).split(' ');
  var cmd = {
    from: from,
    action: args.shift(),
    args: args
  };
  console.log(cmd);
  this._triggerAction(cmd);
};

proto._greet = function(nick) {
  this.say('Hey ' + nick + ', I\'m xraymetabot. I\'m awesome!');
};

proto._triggerAction = function(cmd) {
  if(cmd.action === 'greet') {
    return this._greet(cmd.from);
  }
};

proto.getLastLines = function(amount) {
  amount = amount || 10;
  if(amount > this._lines.length) {
    return this._lines;
  }
  var lastIndex = this._lines.length - 1;
  return this._lines.slice(lastIndex - amount, lastIndex)
};

module.exports = TwitchChat;