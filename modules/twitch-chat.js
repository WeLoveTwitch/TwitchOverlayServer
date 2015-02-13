var Client = require('irc').Client;
var secrets = require('../config/secrets');

function ChatLine(data) {
    this.ts = new Date().getTime();
    this.user = data.user;
    this.nick = data.nick;
    this.message = data.message || data.args[1];
}


function TwitchChat() {

    this._channel = '#' + secrets.bot.channel;

    this._trustedUsers = [
        'xraymeta',
        'kruemelterror1988',
        'raynoir',
        'tooxificati0n'
    ];

    this._client = new Client('irc.twitch.tv', secrets.bot.nick, {
        channels: [this._channel],
        autoRejoin: true,
        sasl: true,
        password: secrets.bot.password,
        nick: secrets.bot.nick,
        userName: secrets.bot.nick,
        autoConnect: true
    });

    this._lines = [];

    this._store = {};

    var that = this;

    this._client.connect();

    this._client.addListener('message', function (from, to, message, data) {
        if (that._isCommand(message)) {
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

    this._client.once('join', function () {
        // do something on join
    });


}

var proto = TwitchChat.prototype;

proto._addLine = function (data) {
    var newLine = new ChatLine(data);
    if (this._checkForDuplicate(newLine) === false) {
        this._lines.push(newLine);
    }
};

proto.say = function (text) {
    this._client.say(this._channel, text);
    this._addLine({
        message: text,
        user: 'bot',
        nick: 'bot'
    });
};

proto._checkForDuplicate = function (obj) {
    for (var i = 0; i < this._lines.length; i++) {
        var line = this._lines[i];
        if (Math.floor(line.ts / 1000) === Math.floor(obj.ts / 1000) && line.user === obj.user && line.message === line.message) {
            return true;
        }
    }
    return false;
};

proto._isCommand = function (message) {
    return message.indexOf('!') === 0;
};

proto._parseCommand = function (from, message) {
    var args = message.slice(1).split(' ');
    var cmd = {
        from: from,
        action: args.shift(),
        args: args
    };
    console.log(cmd);
    this._triggerAction(cmd);
};

proto._greet = function (nick) {
    this.say('Hey ' + nick + ', I\'m ' + secrets.bot.nick + '. I\'m awesome!');
};

proto._schimmel = function (nick) {
    if(!this._store.schimmelCount) {
        this._store.schimmelCount = 0;
    }
    this._store.schimmelCount++;
    this.say('Der Schimmel Counter steht jetzt auf ' + this._store.schimmelCount + ', ' + nick);
};

proto._resetSchimmel = function () {
    this._store.schimmelCount = 0;
};

proto._triggerAction = function (cmd) {
    if (cmd.action === 'greet') {
        return this._greet(cmd.from);
    }
    if (cmd.action === 'schimmel' && this.isTrustedUser(cmd.from)) {
        return this._schimmel(cmd.from);
    }
    if (cmd.action === 'resetSchimmel' && this.isTrustedUser(cmd.from)) {
        return this._resetSchimmel();
    }
};

proto.getLastLines = function (amount) {
    amount = amount || 10;
    if (amount > this._lines.length) {
        return this._lines;
    }
    var lastIndex = this._lines.length;
    return this._lines.slice(lastIndex - amount, lastIndex)
};

proto.isTrustedUser = function(username) {
    return this._trustedUsers.indexOf(username) !== -1;
};

proto.getStore = function() {
    return this._store;
};

module.exports = TwitchChat;