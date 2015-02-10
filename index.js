var express = require('express');
var app = express();
var twitch = require('./modules/twitch')();
var TwitchChat = require('./modules/twitch-chat');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var bot = new TwitchChat();

var sockets = [];

function socketConnected(socket) {
    return socket.connected;
}

io.on('connection', function (socket) {
    sockets.push(socket);
});

function sendUpdate() {
    twitch.get(function (data) {
        sockets.forEach(function (socket) {
            if (!socketConnected(socket)) return false;
            socket.emit('update', {
                follower: data,
                chat: bot.getLastLines(),
                botStore: bot.getStore()
            });
        });
    });
}

(function loop() {
    setTimeout(loop, 5000);
    sendUpdate();
})();

app.use(express.static(__dirname + '/public'));

http.listen(3000, function () {
    console.log('listening on *:3000');
});