var FrontendComponent = require('../lib/frontend-component');
var inherits = require('util').inherits;

function Chat(chat) {
    FrontendComponent.apply(this);

    this._name = 'chat';
    this._chat = chat;
}

inherits(Chat, FrontendComponent);

var proto = Chat.prototype;

proto.bindEvents = function(socket) {
    this.bindGenericEvents(socket);
    var that = this;
    this.bindEvent('_chat', 'message', socket.id, function(message) {
        socket.emit(that._getEventName('message'), message);
    });
};

module.exports = Chat;